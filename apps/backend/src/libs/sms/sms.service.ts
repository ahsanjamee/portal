import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '../../config/config.service';
import * as crypto from 'crypto';
import * as https from 'https';

interface SmsPayload {
    UserName: string;
    Apikey: string;
    MobileNumber: string;
    SenderName: string;
    TransactionType: string;
    Message: string;
}

interface SmsResponse {
    isError: boolean;
    message?: string;
    [key: string]: any;
}

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);
    private readonly otpStore = new Map<string, string>(); // In-memory store for OTPs

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) { }

    /**
     * Send SMS to single or multiple phone numbers
     */
    async sendSms(
        phoneNumbers: string | string[],
        message: string,
        messageType: string = 'OTHER'
    ): Promise<SmsResponse> {
        const senderId = this.configService.values.sms.senderId || '8809601004762';
        const userName = this.configService.values.sms.username;
        const apiKey = this.configService.values.sms.apiKey;

        if (!userName || !apiKey) {
            throw new Error('SMS credentials not configured');
        }

        // Join the phone numbers into a comma-separated string
        const mobileNumberString = Array.isArray(phoneNumbers)
            ? phoneNumbers.map((phone) => `88${phone.trim()}`).join(',')
            : `88${phoneNumbers.trim()}`;

        const payload: SmsPayload = {
            UserName: userName,
            Apikey: apiKey,
            MobileNumber: mobileNumberString,
            SenderName: senderId,
            TransactionType: 'T',
            Message: message,
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        try {
            this.logger.log(`Sending SMS to: ${mobileNumberString}`);

            // Use built-in fetch API (available in Node.js 18+)
            const response = await fetch(
                this.configService.values.sms.apiUrl || 'https://api.mimsms.com/api/SmsSending/SMS',
                requestOptions
            );
            const result = await response.json() as SmsResponse;

            this.logger.log(`SMS API Response: ${JSON.stringify(result)}`);

            // Track SMS for each recipient
            const phoneNumbersArray = Array.isArray(phoneNumbers)
                ? phoneNumbers
                : [phoneNumbers];

            await this.trackSmsMessages(phoneNumbersArray, message, messageType, result);

            return result;
        } catch (error) {
            this.logger.error('Error sending SMS:', error);

            // Track failed SMS
            const phoneNumbersArray = Array.isArray(phoneNumbers)
                ? phoneNumbers
                : [phoneNumbers];

            await this.trackSmsMessages(
                phoneNumbersArray,
                message,
                messageType,
                { isError: true },
                error.message
            );

            throw error;
        }
    }

    /**
     * Send OTP to a phone number
     */
    async sendOtp(phone: string): Promise<{ otp: string; message: string }> {
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in memory (you might want to use Redis for production)
        this.otpStore.set(phone, otp);

        // Set expiration for OTP (5 minutes)
        setTimeout(() => {
            this.otpStore.delete(phone);
        }, 5 * 60 * 1000);

        const message = `ADI এর জন্য আপনার ভেরিফিকেশন কোড ${otp}`;

        await this.sendSms(phone, message, 'OTP');

        return { otp, message };
    }

    /**
     * Verify OTP
     */
    verifyOtp(phone: string, otp: string): boolean {
        const storedOtp = this.otpStore.get(phone);
        if (!storedOtp || storedOtp !== otp) {
            return false;
        }

        // Remove OTP after successful verification
        this.otpStore.delete(phone);
        return true;
    }

    /**
     * Track SMS messages in database
     */
    private async trackSmsMessages(
        phoneNumbers: string[],
        message: string,
        messageType: string,
        result: SmsResponse,
        errorMessage?: string
    ): Promise<void> {
        try {
            const trackingPromises = phoneNumbers.map((phone) =>
                this.prisma.otpTracking.create({
                    data: {
                        companyName: 'ADI',
                        recipientNumber: phone,
                        message,
                        messageType,
                        status: result.isError ? 'FAILED' : 'SUCCESS',
                        provider: 'MIMSMS',
                        errorMessage: result.isError ? (errorMessage || result.message) : null,
                    },
                })
            );

            await Promise.all(trackingPromises);
            this.logger.log(`Tracked ${phoneNumbers.length} SMS messages successfully`);
        } catch (error) {
            this.logger.error('Error tracking SMS messages:', error);
        }
    }

    /**
     * Get SMS tracking statistics
     */
    async getSmsStats(startDate?: Date, endDate?: Date) {
        const whereClause: any = {};

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = startDate;
            if (endDate) whereClause.createdAt.lte = endDate;
        }

        const [total, successful, failed, otpCount] = await Promise.all([
            this.prisma.otpTracking.count({ where: whereClause }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, status: 'SUCCESS' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, status: 'FAILED' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, messageType: 'OTP' }
            }),
        ]);

        return {
            total,
            successful,
            failed,
            otpCount,
            successRate: total > 0 ? (successful / total) * 100 : 0,
        };
    }

    /**
     * Get SMS tracking history
     */
    async getSmsHistory(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            this.prisma.otpTracking.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.otpTracking.count(),
        ]);

        return {
            messages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


} 