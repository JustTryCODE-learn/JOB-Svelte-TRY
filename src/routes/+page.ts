import { getUsers } from '$lib/api';

export async function load({ fetch }) {
	try {
		const users = await getUsers(fetch);

		return {
			ssrUsers: users,
			ssrError: ''
		};
	} catch (error) {
		return {
			ssrUsers: [],
			ssrError: error instanceof Error ? error.message : 'Unable to load users from the API'
		};
	}
}
