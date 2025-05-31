const isSuccess = (status: number) => status >= 200 && status < 300;

type SuccessResponse<T> = {
	statusCode: number;
	headers: Record<string, string>;
	status: 'success';
	data: {
		getText: () => Promise<string>;
		getJSON: () => Promise<T>;
		getBlob: () => Promise<Blob>;
		getArrayBuffer: () => Promise<ArrayBuffer>;
	};
};

type FailedResponse = {
	statusCode: number;
	headers: Record<string, string>;
	status: 'failed';
	getText: () => Promise<string>;
	getJSON: <T>() => Promise<T | null>;
	error: any;
};

type NetWorkFailedResponse = {
	error: Error;
	status: 'network_failed';
};

export type HttpResponse<T> = SuccessResponse<T> | FailedResponse | NetWorkFailedResponse;

export class HttpService {
	constructor(private baseURL: string = '') {}

	getBaseURL(): string {
		const hasSlash = this.baseURL.endsWith('/');
		if (hasSlash) return this.baseURL.slice(0, -1);

		return this.baseURL;
	}

	async get<T>(url: string, headers?: Record<string, string> | null) {
		return this.request<T>('GET', url, headers);
	}

	async post<T>(url: string, body: any, headers?: Record<string, string> | null) {
		return this.request<T>('POST', url, headers, JSON.stringify(body));
	}

	async put<T>(url: string, body: any, headers?: Record<string, string> | null) {
		return this.request<T>('PUT', url, headers, JSON.stringify(body));
	}

	async patch<T>(url: string, body: any, headers?: Record<string, string> | null) {
		return this.request<T>('PATCH', url, headers, JSON.stringify(body));
	}

	async delete<T>(url: string, headers?: Record<string, string> | null) {
		return this.request<T>('DELETE', url, headers);
	}

	async request<T>(
		method: string,
		url: string,
		headers?: Record<string, string> | null,
		body?: any,
	): Promise<HttpResponse<T>> {
		try {
			const options: RequestInit = {
				method,
				body,
				...(headers !== null
					? { headers: headers === undefined ? { 'content-type': 'application/json' } : headers }
					: {}),
			};

			const response: any = await fetch(this.getURL(url), options);

			if (isSuccess(response.status)) {
				return {
					statusCode: response.status,
					status: 'success',
					data: {
						getJSON: () => response.json().catch(() => null) as Promise<T>,
						getText: () => response.text() as Promise<string>,
						getBlob: () => response.blob() as Promise<Blob>,
						getArrayBuffer: () => response.arrayBuffer() as Promise<ArrayBuffer>,
					},
					headers: Object.fromEntries(response.headers.entries()),
				};
			}

			return {
				statusCode: response.status,
				status: 'failed',
				error: await (async () => {
					try {
						return await response.json();
					} catch (_) {
						return await response.text();
					}
				})(),
				getJSON: <U>() => response.json().catch(() => null) as Promise<U>,
				getText: () => response.text(),
				headers: Object.fromEntries(response.headers.entries()),
			};
		} catch (error) {
			return {
				status: 'network_failed',
				error,
			};
		}
	}

	private getURL(url: string): string {
		// if any full url provided, return it
		if (!this.getBaseURL()) return url;

		if (url.startsWith('/')) {
			return this.getBaseURL() + url;
		}

		return `${this.getBaseURL()}/${url}`;
	}
}
