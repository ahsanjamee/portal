const nonAuthUrls = ['login', 'forgot-password', 'reset-password'];

export const getRedirectURL = () => {
    const url = window.location.href;

    const isBaseUrl = url.endsWith(`${import.meta.env.VITE_DOMAIN_URL}/`);
    if (isBaseUrl) {
        return undefined;
    }

    const hasRedirectUrl = !nonAuthUrls.some((nonauthUrl) => url.includes(nonauthUrl));
    // detect if the url is not homepage
    if (hasRedirectUrl) {
        return url;
    }
    return undefined;
};

export const getRedirectUrlFromSearchParams = () => {
    const url = new URL(window.location.href);
    const redirectUrl = url.searchParams.get('redirect_url');
    return redirectUrl;
};
