import { LoginResponse } from '@/lib/entities/login.entity';
import { getStoreClass } from '@poly-state/core';
import { createStoreSelector } from '@poly-state/react';
import { CreateAdminUserDto, CreateEndUserDto } from '@portal/portal-api-client';
import cookie from 'js-cookie';
import { createContext, useContext } from 'react';

export type GlobalStoreType = {
    authenticated: boolean;
    profile: CreateEndUserDto | CreateAdminUserDto | null;
    accessToken: string;
    refreshToken: string;
    language: 'en' | 'no';
    showOverly: boolean;
    authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN_USER' | null
};

export const globalStoreInitialState: GlobalStoreType = {
    authenticated: false,
    profile: null,
    accessToken: '',
    refreshToken: '',
    language: 'en',
    showOverly: false,
    authType: null
};

export type CookieStorage = {
    accessToken: string;
    refreshToken: string;
    authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN_USER' | null
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
        }));

        setGlobalStoreCookie(() => {
            return {
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
                authType: res.authType
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
