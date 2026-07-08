<svelte:head>
	<title>SvelteKit Demo</title>
</svelte:head>

<main class="home-page">
	<h1>SvelteKit Practice Project</h1>
	<p class="subtitle">The demos are split into separate pages so each part is easier to review.</p>

	<div class="links">
		<a href="/components">
			<strong>Components</strong>
			<span>Button, Input, Forms, Modal, and Table examples.</span>
		</a>

		<a href="/posts">
			<strong>Posts</strong>
			<span>CRUD demo using the DummyJSON posts API.</span>
		</a>
	</div>
</main>

<style>
	.home-page {
		max-width: 850px;
		margin: 64px auto;
		padding: 0 20px;
		font-family: system-ui, -apple-system, sans-serif;
		color: #1e293b;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 34px;
	}

	.subtitle {
		margin: 0 0 24px;
		color: #64748b;
	}

	.links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
	}

	a {
		display: block;
		padding: 20px;
		border: 1px solid #d8e0ea;
		border-radius: 8px;
		background: white;
		color: #1e293b;
		text-decoration: none;
	}

	a:hover {
		border-color: #3b82f6;
	}

	strong,
	span {
		display: block;
	}

	strong {
		margin-bottom: 8px;
		font-size: 18px;
	}

	span {
		color: #64748b;
		line-height: 1.4;
	}
</style>
