import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
// import { settingService } from '@/lib/services/settings.service';
import { useGlobalStore, useGlobalStoreSelector } from '@/stores/global.store';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { RiArrowDownSLine } from 'react-icons/ri';

export const LanguageSwitcher = () => {
	const language = useGlobalStoreSelector((s) => s.language);
	const isLoggedIn = useGlobalStoreSelector((s) => s.authenticated);
	const { store } = useGlobalStore();

	// const { mutateAsync } = settingService.useUpdateUserProfile();

	const changeLanguage = async (lang: 'en' | 'no') => {
		// const currentLang = store.getState().language;

		store.setLanguage(lang);
		if (!isLoggedIn) return;

		// await mutateAsync({
		// 	language: lang,
		// }).catch(() => {
		// 	store.setLanguage(currentLang);
		// });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="flex gap-2 justify-center items-center">
					<div className="text-xs sm:text-base">{language === 'en' ? '🇬🇧 English' : '🇳🇴 Norsk'}</div>
					<RiArrowDownSLine className="hover:fill-vadio-brand-600" />
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Language</DropdownMenuLabel>
				<DropdownMenuCheckboxItem
					className="cursor-pointer"
					checked={language === 'en'}
					onCheckedChange={() => changeLanguage('en')}
				>
					🇬🇧 English
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					className="cursor-pointer"
					checked={language === 'no'}
					onCheckedChange={() => changeLanguage('no')}
				>
					🇳🇴 Norsk
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
