const BASE_URL = 'https://dummyjson.com';

export async function getPosts(limit = 10) {
	const res = await fetch(`${BASE_URL}/posts?limit=${limit}`);
	if (!res.ok) {
		throw new Error('cannot load posts');
	}
	return res.json();
}

export async function createPost(title: string, body: string, userId: number) {
	const res = await fetch(`${BASE_URL}/posts/add`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, body, userId })
	});
	if (!res.ok) {
		throw new Error('cannot create post');
	}
	return res.json();
}

export async function updatePost(id: number, title: string, body: string) {
	const res = await fetch(`${BASE_URL}/posts/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, body })
	});
	if (!res.ok) {
		throw new Error('cannot update post');
	}
	return res.json();
}

export async function deletePost(id: number) {
	const res = await fetch(`${BASE_URL}/posts/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw new Error('cannot delete post');
	}
	return res.json();
}
