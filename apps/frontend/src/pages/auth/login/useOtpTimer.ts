import { useState, useEffect, useRef, useCallback } from 'react';

export const useOtpTimer = (initialTime: number = 180) => { // 3 minutes = 180 seconds
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback(() => {
        console.log("startTimer called - setting timeLeft to:", initialTime);
        setTimeLeft(initialTime);
        setIsActive(true);
        console.log("Timer activated");
    }, [initialTime]);

    const resetTimer = useCallback(() => {
        setTimeLeft(initialTime);
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [initialTime]);

    const stopTimer = useCallback(() => {
        setIsActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        console.log("Timer useEffect triggered - isActive:", isActive, "timeLeft:", timeLeft);
        if (isActive && timeLeft > 0) {
            console.log("Starting interval...");
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        console.log("Timer finished");
                        setIsActive(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                console.log("Clearing interval");
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const canResend = !isActive && timeLeft === 0;

    return {
        timeLeft,
        isActive,
        canResend,
        startTimer,
        resetTimer,
        stopTimer,
        formatTime: () => formatTime(timeLeft),
    };
}; 