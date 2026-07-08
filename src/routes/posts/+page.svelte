<script lang="ts">
	import { onMount } from 'svelte';
	import { createPost, deletePost, getPosts, updatePost, type Post } from '$lib/api';
	import Button from '$lib/Button.svelte';
	import Forms from '$lib/Forms.svelte';
	import Input from '$lib/Input.svelte';
	import Table from '$lib/Table.svelte';

	type PageData = {
		posts: Post[];
		total: number;
		error: string;
	};

	let { data }: { data: PageData } = $props();

	let localPosts = $state<Post[] | null>(null);
	let selectedPostId = $state<number | null>(null);
	let form = $state({
		title: '',
		body: '',
		userId: '1'
	});
	let errors = $state({
		title: '',
		body: '',
		userId: ''
	});
	let localApiMessage = $state('');
	let isLoading = $state(false);
	let isLoadingPosts = $state(false);

	const columns = [
		{ key: 'title', label: 'Title', width: '260px' },
		{ key: 'body', label: 'Body', width: '420px' },
		{ key: 'userId', label: 'User ID', width: '100px' }
	];

	function getPostsList() {
		if (localPosts) {
			return localPosts;
		}

		return data.posts;
	}

	function getApiMessage() {
		if (localApiMessage) {
			return localApiMessage;
		}

		return data.error;
	}

	function getTableRows() {
		const posts = getPostsList();

		return posts.map((post) => {
			return {
				id: String(post.id),
				title: post.title,
				body: post.body,
				userId: post.userId
			};
		});
	}

	async function loadPosts() {
		isLoadingPosts = true;
		localApiMessage = 'Loading posts from DummyJSON...';

		try {
			const result = await getPosts(10);
			localPosts = result.posts;
			localApiMessage = '';
		} catch {
			localPosts = [];
			localApiMessage = 'Failed to fetch posts. Please check your internet connection and try again.';
		} finally {
			isLoadingPosts = false;
		}
	}

	function validatePostForm() {
		errors = {
			title: '',
			body: '',
			userId: ''
		};

		if (!form.title.trim()) {
			errors.title = 'Title is required';
		}

		if (!form.body.trim()) {
			errors.body = 'Body is required';
		}

		if (!Number(form.userId)) {
			errors.userId = 'User ID must be a number';
		}

		return !errors.title && !errors.body && !errors.userId;
	}

	function resetForm() {
		selectedPostId = null;
		form = {
			title: '',
			body: '',
			userId: '1'
		};
		errors = {
			title: '',
			body: '',
			userId: ''
		};
	}

	function handleSelectPost(id: string) {
		const posts = getPostsList();
		const post = posts.find((item) => item.id === Number(id));

		if (!post) return;

		selectedPostId = post.id;
		form = {
			title: post.title,
			body: post.body,
			userId: String(post.userId)
		};
		localApiMessage = `Editing post #${post.id}`;
	}

	async function handleSubmitPost() {
		if (!validatePostForm()) return;

		isLoading = true;
		localApiMessage = '';

		try {
			if (selectedPostId) {
				const updatedPost = await updatePost(selectedPostId, form.title.trim(), form.body.trim());
				const posts = getPostsList();

				localPosts = posts.map((post) => {
					if (post.id === selectedPostId) {
						return {
							...post,
							...updatedPost,
							userId: Number(form.userId)
						};
					}

					return post;
				});
				localApiMessage = `Updated post #${selectedPostId}`;
			} else {
				const newPost = await createPost(form.title.trim(), form.body.trim(), Number(form.userId));
				const posts = getPostsList();

				localPosts = [newPost, ...posts];
				localApiMessage = `Created post #${newPost.id}`;
			}

			resetForm();
		} catch (error) {
			localApiMessage = error instanceof Error ? error.message : 'Unable to save post';
		} finally {
			isLoading = false;
		}
	}

	async function handleDeleteSelected() {
		if (!selectedPostId) return;

		isLoading = true;
		localApiMessage = '';

		try {
			await deletePost(selectedPostId);
			const posts = getPostsList();

			localPosts = posts.filter((post) => post.id !== selectedPostId);
			localApiMessage = `Deleted post #${selectedPostId}`;
			resetForm();
		} catch (error) {
			localApiMessage = error instanceof Error ? error.message : 'Unable to delete post';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		loadPosts();
	});
</script>

<svelte:head>
	<title>Posts CRUD</title>
</svelte:head>

<main class="posts-page">
	<header class="page-header">
		<div>
			<a href="/" class="back-link">Home</a>
			<h1>Posts CRUD</h1>
			<p>DummyJSON API integration for creating, reading, updating, and deleting posts.</p>
		</div>
		<a class="docs-link" href="https://dummyjson.com/docs/posts" target="_blank" rel="noreferrer">
			DummyJSON docs
		</a>
	</header>

	<section class="content-grid">
		<div class="panel">
			<Forms title={selectedPostId ? `Edit post #${selectedPostId}` : 'Create post'} onSubmit={handleSubmitPost}>
				{#snippet children()}
					<Input label="Title" bind:value={form.title} err={errors.title} />
					<Input label="Body" bind:value={form.body} err={errors.body} />
					<Input label="User ID" type="number" bind:value={form.userId} err={errors.userId} />

					<div class="form-actions">
						<Button
							type="submit"
							variant="primary"
							inputState={isLoading ? 'loading' : 'default'}
						>
							{isLoading ? 'Saving...' : selectedPostId ? 'Update post' : 'Create post'}
						</Button>

						<Button type="button" variant="surface" onClick={resetForm}>
							Clear
						</Button>

						<Button
							type="button"
							variant="danger"
							inputState={!selectedPostId || isLoading ? 'disabled' : 'default'}
							onClick={handleDeleteSelected}
						>
							Delete selected
						</Button>
					</div>
				{/snippet}
			</Forms>

			{#if getApiMessage()}
				<p class="api-message">{getApiMessage()}</p>
			{/if}
		</div>

		<div class="panel">
			<h2>Posts</h2>
			<p class="table-help">Posts are loaded from DummyJSON in the browser.</p>
			<div class="table-actions">
				<Button
					type="button"
					variant="info"
					inputState={isLoadingPosts ? 'loading' : 'default'}
					onClick={loadPosts}
				>
					{isLoadingPosts ? 'Loading...' : 'Reload posts'}
				</Button>
			</div>
			<Table
				columns={columns}
				data={getTableRows()}
				totalItems={getTableRows().length}
				pageSize={10}
				currentPage={1}
				selectedIds={selectedPostId ? [String(selectedPostId)] : []}
				isChecked={true}
				onSelectRow={handleSelectPost}
			/>
		</div>
	</section>
</main>

<style>
	.posts-page {
		max-width: 1180px;
		margin: 40px auto;
		padding: 0 20px;
		font-family: system-ui, -apple-system, sans-serif;
		color: #172033;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}

	.back-link,
	.docs-link {
		color: #2563eb;
		font-weight: 600;
		text-decoration: none;
	}

	h1,
	h2 {
		margin: 0;
	}

	h1 {
		margin-top: 8px;
		font-size: 32px;
	}

	h2 {
		margin-bottom: 8px;
		font-size: 22px;
	}

	p {
		margin: 8px 0 0;
		color: #64748b;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
		gap: 24px;
		align-items: start;
	}

	.panel {
		background: #ffffff;
		border: 1px solid #d8e0ea;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
	}

	.form-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.api-message {
		margin-top: 16px;
		padding: 12px;
		border-radius: 6px;
		background: #eef6ff;
		color: #1d4ed8;
		font-weight: 600;
	}

	.table-help {
		margin-bottom: 16px;
	}

	.table-actions {
		margin-bottom: 16px;
	}

	@media (max-width: 820px) {
		.page-header,
		.content-grid {
			grid-template-columns: 1fr;
		}

		.page-header {
			display: block;
		}

		.docs-link {
			display: inline-block;
			margin-top: 12px;
		}
	}
</style>
