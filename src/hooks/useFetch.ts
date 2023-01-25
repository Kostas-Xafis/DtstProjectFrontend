import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/Index';

type ApiFetch<ExpectedResponse> = {
	request?: {
		path: string;
		method: 'GET' | 'POST' | 'DELETE';
		body?: {
			[k: string]: any;
		};
	};
	response?: ExpectedResponse;
	error?: {
		status: number;
		message: string;
	};
};

export type NoResponse = {
	message?: string;
};

export function useFetch<T = NoResponse>(request: ApiFetch<T>, expectResponse: boolean = true) {
	const [data, setData] = useState<ApiFetch<T>>(request);
	const { authData } = useContext(AuthContext);
	useEffect(() => {
		if (data.request) {
			(async function () {
				if (!data.request || data.response) return;
				const response = await fetch(data.request.path, {
					'method': data.request.method,
					'body': data.request.body ? JSON.stringify(data.request.body) : null,
					'headers': {
						'Content-Type': data.request.method == 'POST' ? 'application/json' : '',
						'Authorization': authData.accessToken ? 'Bearer ' + authData.accessToken : '',
					},
				});
				if (response.status >= 400) {
					const text = await response.text();
					const message = text ? JSON.parse(text) : {};
					return setData({ error: { status: response.status, ...message } });
				}
				const json = (await response.json()) as T;
				//It's empty on user update and it throws error
				setData({ response: json });
			})();
		}
		if (data.error) console.log('UseFetch error:', data.error);
		if (data.response) console.log('UseFetch response:', data.response);
	}, [data.request]);
	return [data, setData] as const;
}
