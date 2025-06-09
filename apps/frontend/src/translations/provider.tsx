/* eslint-disable react-refresh/only-export-components */
import { useGlobalStoreSelector } from '@/stores/global.store';
import { createContext, FC, PropsWithChildren, useCallback, useContext } from 'react';
import { en } from './en';
import { no } from './no';

const translations = {
	en,
	no,
} as const;

const TranslationContext = createContext<typeof translations | null>(null);

export const WithTranslations: FC<PropsWithChildren> = ({ children }) => {
	return (
		<TranslationContext.Provider
			value={{
				en,
				no,
			}}
		>
			{children}
		</TranslationContext.Provider>
	);
};

export type TranslatorFunction = (key: keyof (typeof translations)['en'], fallback?: string) => string;

export const useTranslate = () => {
	const ctx = useContext(TranslationContext);

	if (!ctx) {
		throw new Error('Missing_translation_context');
	}

	const currentLanguage = useGlobalStoreSelector((s) => s.language);

	return useCallback(
		(key: keyof (typeof translations)['en'], fallback?: string) => {
			return ctx[currentLanguage][key] || fallback || key;
		},
		[ctx, currentLanguage],
	);
};
