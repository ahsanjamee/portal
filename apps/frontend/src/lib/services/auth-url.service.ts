class AuthUrlService {
	url: URL;

	constructor(url: string) {
		this.url = new URL(url);
	}

	getEmail() {
		return this.url.searchParams.get('email') as string;
	}
	getCode() {
		return this.url.searchParams.get('code');
	}
	getCompanyID() {
		return this.url.searchParams.get('companyID');
	}

	hasEmail() {
		if (this.getEmail()) {
			return true;
		}

		return false;
	}

	hasCode() {
		if (this.hasEmail() && this.getCode()) {
			return true;
		}

		return false;
	}
	hasCompanyID() {
		if (this.getCompanyID()) {
			return true;
		}

		return false;
	}
}

export const useAuthUrlService = () => {
	return new AuthUrlService(decodeURI(window.location.href));
};
