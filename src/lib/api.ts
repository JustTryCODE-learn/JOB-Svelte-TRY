export type ApiUser = {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
	website: string;
};

export async function getUsers(fetchFn: typeof fetch = fetch): Promise<ApiUser[]> {
	const response = await fetchFn('https://jsonplaceholder.typicode.com/users');

	if (!response.ok) {
		throw new Error('Unable to load users from the API');
	}

	return response.json();
}
