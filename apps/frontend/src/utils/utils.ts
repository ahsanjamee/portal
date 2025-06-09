import { CompanyUserRole } from '@/stores/types';
import { notifications } from '@mantine/notifications';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isEmail = (email: string) => {
    const emailValidation =
        /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/gi;

    return emailValidation.test(email);
};

export const groupAvatarLimit = 3;
export const otpCodeLimit = 6;

export const getDefaultAvatar = (name: string) => {
    return name.slice(0, 1).toUpperCase();
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export const getTranslatedRole = (role: CompanyUserRole) => {
    switch (role) {
        case 'ADMIN':
            return 'ADMIN';
        case 'MEMBER':
            return 'MEMBER';
        default:
            return 'OWNER';
    }
};

export const hex2rgba = (hex: string, alpha = 1) => {
    const [r, g, b] = (hex.match(/\w\w/g) as string[]).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

export const createYoutubeIframeSrc = (url: string) => {
    // Extract video ID from the URL
    const videoId = url?.split('e/')[1];

    return `https://www.youtube.com/embed/${videoId}`;
};

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

export function getUrlFromString(str: string) {
    if (isValidUrl(str)) return str;
    try {
        return str.includes('.') && !str.includes(' ') ? new URL(`https://${str}`).toString() : null;
    } catch (e) {
        return null;
    }
}

export const toHumanReadableFormat = (data: string) => {
    if (!data) {
        return '';
    }
    return data.charAt(0).toUpperCase() + data.slice(1).replace('_', ' ').toLowerCase();
};

export function convertDateToNorwegian(dateStr: string, lang: string): string {
    if (lang === 'en') return dateStr;
    // Dictionary to map English month abbreviations to Norwegian month abbreviations
    const monthMapping: { [key: string]: string } = {
        Jan: 'Jan',
        Feb: 'Feb',
        Mar: 'Mar',
        Apr: 'Apr',
        May: 'Mai',
        Jun: 'Jun',
        Jul: 'Jul',
        Aug: 'Aug',
        Sep: 'Sep',
        Oct: 'Okt',
        Nov: 'Nov',
        Dec: 'Des',
    };

    // Split the input date string into parts
    const [month, day, year] = dateStr.split(' ');

    // Remove the comma from the day part
    const dayNumber = day?.slice(0, -1);

    // Get the Norwegian month abbreviation
    const norwegianMonth = monthMapping[month?.slice(0, 3) as string];

    // Construct and return the Norwegian formatted date string
    return `${dayNumber}. ${norwegianMonth}, ${year}`;
}

export const renderGenericError = (error: Error, message?: string) => {
    notifications.show({
        title: 'Error',
        message: message ?? error?.message,
        color: 'red',
    });
};
