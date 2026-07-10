<script lang="ts">
	import { onMount } from 'svelte';
	import { createPost, deletePost, getPosts, updatePost } from '$lib/api';
	import Button from '$lib/Button.svelte';
	import Forms from '$lib/Forms.svelte';
	import Input from '$lib/Input.svelte';
	import Table from '$lib/Table.svelte';

	let posts = $state<any[]>([]);
	let editingId = $state<number | null>(null);
	let title = $state('');
	let body = $state('');
	let userId = $state('1');
	let titleErr = $state('');
	let bodyErr = $state('');
	let userIdErr = $state('');
	let message = $state('');
	let loading = $state(false);

	const columns = [
		{ key: 'title', label: 'Title', width: '200px' },
		{ key: 'body', label: 'Body', width: '350px' },
		{ key: 'userId', label: 'User ID', width: '80px' }
	];

	function getTableData() {
		return posts.map((p) => ({
			id: String(p.id),
			title: p.title,
			body: p.body,
			userId: p.userId
		}));
	}

	async function reloadPosts() {
		loading = true;
		message = 'loading...';
		try {
			const result = await getPosts(10);
			posts = result.posts;
			message = '';
		} catch (e) {
			posts = [];
			message = 'load failed';
			console.log(e);
		}
		loading = false;
	}

	function checkForm() {
		titleErr = '';
		bodyErr = '';
		userIdErr = '';

		if (!title.trim()) titleErr = 'title required';
		if (!body.trim()) bodyErr = 'body required';
		if (!userId || isNaN(Number(userId))) userIdErr = 'user id must be number';

		return !titleErr && !bodyErr && !userIdErr;
	}

	function clearForm() {
		editingId = null;
		title = '';
		body = '';
		userId = '1';
		titleErr = '';
		bodyErr = '';
		userIdErr = '';
	}

	function pickPost(id: string) {
		const post = posts.find((p) => p.id === Number(id));
		if (!post) return;

		editingId = post.id;
		title = post.title;
		body = post.body;
		userId = String(post.userId);
		message = 'editing post ' + post.id;
	}

	async function savePost() {
		if (!checkForm()) return;

		loading = true;
		message = '';

		try {
			if (editingId) {
				const updated = await updatePost(editingId, title.trim(), body.trim());
				posts = posts.map((p) => {
					if (p.id === editingId) {
						return { ...p, ...updated, userId: Number(userId) };
					}
					return p;
				});
				message = 'updated post #' + editingId;
			} else {
				const created = await createPost(title.trim(), body.trim(), Number(userId));
				posts = [created, ...posts];
				message = 'created post #' + created.id;
			}
			clearForm();
		} catch (e: any) {
			message = e?.message || 'save failed';
		}

		loading = false;
	}

	async function removePost() {
		if (!editingId) return;

		loading = true;
		try {
			await deletePost(editingId);
			posts = posts.filter((p) => p.id !== editingId);
			message = 'deleted post #' + editingId;
			clearForm();
		} catch (e: any) {
			message = e?.message || 'delete failed';
		}
		loading = false;
	}

	onMount(() => {
		reloadPosts();
	});
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>

<main class="page">
	<a href="/">← back</a>
	<h1>Posts CRUD</h1>
	<p>
		using dummyjson api -
		<a href="https://dummyjson.com/docs" target="_blank" rel="noreferrer">docs link</a>
	</p>

	<div class="layout">
		<section class="box">
			<Forms title={editingId ? 'Edit post' : 'Add post'} onSubmit={savePost}>
				{#snippet children()}
					<Input label="Title" bind:value={title} err={titleErr} />
					<Input label="Body" bind:value={body} err={bodyErr} />
					<Input label="User ID" type="number" bind:value={userId} err={userIdErr} />

					<div class="btns">
						<Button type="submit" variant="primary" inputState={loading ? 'loading' : 'default'}>
							{editingId ? 'Update' : 'Create'}
						</Button>
						<Button type="button" variant="surface" onClick={clearForm}>Clear</Button>
						<Button
							type="button"
							variant="danger"
							inputState={!editingId || loading ? 'disabled' : 'default'}
							onClick={removePost}
						>
							Delete
						</Button>
					</div>
				{/snippet}
			</Forms>

			{#if message}
				<p class="msg">{message}</p>
			{/if}
		</section>

		<section class="box">
			<h2>Post list</h2>
			<Button type="button" variant="info" inputState={loading ? 'loading' : 'default'} onClick={reloadPosts}>
				Reload
			</Button>

			<Table
				columns={columns}
				data={getTableData()}
				totalItems={posts.length}
				pageSize={10}
				currentPage={1}
				selectedIds={editingId ? [String(editingId)] : []}
				isChecked={true}
				onSelectRow={pickPost}
			/>
		</section>
	</div>
</main>

<style>
	.page {
		max-width: 1100px;
		margin: 30px auto;
		padding: 0 16px;
		font-family: system-ui, sans-serif;
	}

	h1 {
		margin: 8px 0;
	}

	p {
		color: #666;
	}

	.layout {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.box {
		flex: 1;
		min-width: 280px;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 16px;
		background: #fff;
	}

	.btns {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.msg {
		margin-top: 12px;
		padding: 8px;
		background: #f0f7ff;
		color: #2563eb;
	}

	a {
		color: #2563eb;
	}
</style>
