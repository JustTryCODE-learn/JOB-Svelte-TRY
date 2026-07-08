export type Post = {
	id: number;
	title: string;
	body: string;
	userId: number;
	tags?: string[];
	reactions?: {
		likes: number;
		dislikes: number;
	};
};

type PostsResponse = {
	posts: Post[];
	total: number;
	skip: number;
	limit: number;
};

const API_BASE_URL = 'https://dummyjson.com';

export async function getPosts(limit = 10, fetchFn: typeof fetch = fetch): Promise<PostsResponse> {
	const response = await fetchFn(`${API_BASE_URL}/posts?limit=${limit}`);

	if (!response.ok) {
		throw new Error('Unable to load posts from DummyJSON');
	}

	const data = await response.json();
	return data;
}

export async function createPost(title: string, body: string, userId: number, fetchFn: typeof fetch = fetch) {
	const response = await fetchFn(`${API_BASE_URL}/posts/add`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			title,
			body,
			userId
		})
	});

	if (!response.ok) {
		throw new Error('Unable to create post');
	}

	const data: Post = await response.json();
	return data;
}

export async function updatePost(id: number, title: string, body: string, fetchFn: typeof fetch = fetch) {
	const response = await fetchFn(`${API_BASE_URL}/posts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			title,
			body
		})
	});

	if (!response.ok) {
		throw new Error('Unable to update post');
	}

	const data: Post = await response.json();
	return data;
}

export async function deletePost(id: number, fetchFn: typeof fetch = fetch) {
	const response = await fetchFn(`${API_BASE_URL}/posts/${id}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error('Unable to delete post');
	}

	const data = await response.json();
	return data;
}
