import { LoginResponse } from '@/lib/entities/login.entity';
import { getStoreClass } from '@poly-state/core';
import { createStoreSelector } from '@poly-state/react';
import cookie from 'js-cookie';
import { createContext, useContext } from 'react';

export type AdminUserProfile = {
    id: string;
    name: string;
    address: string;
    photo?: string | null;
    lastDegree: string;
    areaOfExpertise: string;
    serviceExperience: number;
    jobPosition?: string | null;
    userType: 'SERVICE_PROVIDER' | 'TRADER_CHEMIST';
    userId: string;
}

export type EndUserProfile = {
    id: string;
    name: string;
    address: string;
    farmData: any;
    userId: string;
    photo?: string | null;
    userType: 'DAIRY_FARMER' | 'POULTRY_FARMER' | 'FISH_FARMER' | 'AGRICULTURE_FARMER';
}

export type GlobalStoreType = {
    authenticated: boolean;
    profile: EndUserProfile | AdminUserProfile | null;
    email?: string;
    mobileNumber: string;
    accessToken: string;
    refreshToken: string;
    language: 'en' | 'no';
    showOverly: boolean;
    authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN' | null
};

export const globalStoreInitialState: GlobalStoreType = {
    authenticated: false,
    profile: null,
    email: '',
    mobileNumber: '',
    accessToken: '',
    refreshToken: '',
    language: 'en',
    showOverly: false,
    authType: null
};

export type CookieStorage = {
    accessToken: string;
    refreshToken: string;
    authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN' | null
    profile: EndUserProfile | AdminUserProfile | null
    email: string;
    mobileNumber: string;
};

export const getGlobalStoreCookie = () => {
    const cookies = cookie.get('DEFAULT_DATA');

    if (!cookies) {
        return null;
    }

    try {
        return JSON.parse(cookies) as CookieStorage;
    } catch (error) {
        return null;
    }
};

export const setGlobalStoreCookie = (updater: (prev: CookieStorage | null) => CookieStorage | null) => {
    const data = updater(getGlobalStoreCookie());
    const currentDomain = window.location.hostname.includes(import.meta.env.VITE_APP_DOMAIN)
        ? import.meta.env.VITE_APP_DOMAIN
        : window.location.hostname;

    if (!data) {
        cookie.remove('DEFAULT_DATA', {
            secure: true,
            expires: 365,
            domain: currentDomain,
            sameSite: 'strict',
        });

        return;
    }

    cookie.set('DEFAULT_DATA', JSON.stringify(data), {
        secure: true,
        expires: 365,
        domain: currentDomain,
        sameSite: 'strict',
    });
};

export class GlobalStore extends getStoreClass<GlobalStoreType>() {
    constructor(init: GlobalStoreType = globalStoreInitialState) {
        super(init);
    }


    onLogin = (res: LoginResponse) => {
        this.setState((p) => ({
            ...p,
            authenticated: true,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            profile: res.profile!,
            authType: res.authType,
            language: 'en',
            email: res.email || '',
            mobileNumber: res.mobileNumber || '',
        }));

        setGlobalStoreCookie(() => {
            return {
                email: res.email || '',
                mobileNumber: res.mobileNumber || '',
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
                authType: res.authType,
                profile: res.profile || null,
            };
        });
    };

    onUpdateProfile = (res: any) => {
        this.setState((p) => ({
            ...p,
            profile: res.profile,
            email: res.user.email || '',
        }));

        setGlobalStoreCookie((prev) => {
            if (!prev) {
                return null;
            }

            return {
                email: res.user.email || '',
                mobileNumber: prev.mobileNumber,
                accessToken: prev.accessToken,
                refreshToken: prev.refreshToken,
                authType: prev.authType,
                profile: res.profile || null,
            };
        });
    };

    onLogout = () => {
        this.setState(globalStoreInitialState);
        setGlobalStoreCookie(() => null);
    };
}

export const GlobalStoreContext = createContext<GlobalStore | null>(null);

export const useGlobalStore = () => {
    const store = useContext(GlobalStoreContext);

    if (!store) {
        throw new Error('useGlobalStore_must_be_used_within_a_GlobalStoreProvider.');
    }

    const select = createStoreSelector(store);

    return { store, select };
};

export const useGlobalStoreSelector = <U>(fn: (store: GlobalStoreType) => U): U => {
    const { select } = useGlobalStore();

    return select(fn);
};
