<svelte:head>
	<title>Home</title>
</svelte:head>

<main class="home">
	<h1>Svelte Practice</h1>
	<p>pick a page below:</p>

	<ul>
		<li><a href="/components">Components demo</a> - input, button, modal, table, form validation</li>
		<li><a href="/posts">Posts</a> - CRUD with dummyjson</li>
	</ul>
</main>

<style>
	.home {
		max-width: 700px;
		margin: 50px auto;
		padding: 0 20px;
		font-family: system-ui, sans-serif;
	}

	ul {
		line-height: 1.8;
	}

	a {
		color: #2563eb;
	}
</style>
