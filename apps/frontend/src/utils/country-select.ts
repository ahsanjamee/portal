export const SELECTED_COUNTRY = 'SELECTED_COUNTRY';

export const setSelectedCountryData = ({ id, country }: { id: string; country: string }) => {
    const val = JSON.stringify({ id, country });
    localStorage.setItem(SELECTED_COUNTRY, val);
    return { id, country };
};

export const getSelectedCountryData = () => {
    const res = localStorage.getItem(SELECTED_COUNTRY);
    return res === null ? { id: '', type: '' } : JSON.parse(res);
};
