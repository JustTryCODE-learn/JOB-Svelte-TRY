<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import Table from '$lib/Table.svelte';

	let username = $state('');
	let accountType = $state('');
	let techStack = $state([]);

	let selectedVariant = $state<'primary' | 'danger' | 'success' | 'warning'>('primary');
	let isOutline = $state(false);
	let currentFormState = $state<'default' | 'loading' | 'disabled'>('default');

	let isModalOpen = $state(false);

	let tableCurrentPage = $state(1);
	let tablePageSize = $state(10);
	let tableSelectedIds = $state<string[]>([]);
	
	const tableColumns = [
		{ key: 'name', label: 'Username', width: '200px' },
		{ key: 'accountType', label: 'Account Type', width: '150px' },
		{ key: 'techStack', label: 'Tech Stack', width: '250px' }
	];

	let tableData = $state<Array<{ id: string; name: string; accountType: string; techStack: string }>>([]);

	let paginatedTableData = $derived(tableData.slice(
		(tableCurrentPage - 1) * tablePageSize,
		tableCurrentPage * tablePageSize
	));
	
	const typeOptions = [
		{label: 'Personal', value: 'personal'},
		{label: 'Business', value: 'business'}
	];

	const techOptions = [
		{label: 'React', value: 'react'},
		{label: 'Svelte', value: 'svelte'},
		{label: 'Vue', value: 'vue'}
	];

	function handleFormSubmit() {
		if (!username) {
			alert('Please enter a username');
			return;
		}
		currentFormState = 'loading';
		setTimeout(() => {
			currentFormState = 'default';
			const newAccount = {
				id: String(Date.now()), 
				name: username,
				accountType: accountType || 'Not selected',
				techStack: techStack.length > 0 ? techStack.join(', ') : 'Not selected'
			};
			
			tableData = [...tableData, newAccount];
			isModalOpen = true;
		}, 2000);
	}

	function handleModalConfirm() {
		console.log('Modal confirmed with username:', username);
	}

	function handleModalCancel() {
		console.log('Modal cancelled');
	}

	function handleTablePaging(page: number) {
		tableCurrentPage = page;
		console.log('Page changed to:', page);
	}

	function handleTablePageSizeChange(size: number) {
		tablePageSize = size;
		tableCurrentPage = 1; // Reset to first page
		console.log('Page size changed to:', size);
	}

	function handleTableSelectAll() {
		const currentPageIds = paginatedTableData.map(row => row.id);
		const areAllCurrentPageSelected = currentPageIds.every(id => tableSelectedIds.includes(id));
		if (areAllCurrentPageSelected) {
			tableSelectedIds = tableSelectedIds.filter(id => !currentPageIds.includes(id));
		} else {
			tableSelectedIds = [...new Set([...tableSelectedIds, ...currentPageIds])];
		}
	}

	function handleTableSelectRow(id: string) {
		if (tableSelectedIds.includes(id)) {
			tableSelectedIds = tableSelectedIds.filter(item => item !== id);
		} else {
			tableSelectedIds = [...tableSelectedIds, id];
		}
	}
</script>

<main class="test-page">
    <h2>🧪 DEMO / Test Component: Input & Button & Modal</h2>
    <p class="subtitle">This is a demo of the Input and Button and Modal components working interactively.</p>

    <div class="demo-layout">
    
        <div class="card input-section">
            <h3>1. Input Component</h3>
            <Input 
                type="text"
                label="Username"
                required={true}
                placeholder="Enter your username"
                icon="👤"
                iconPlacement="start"
                bind:value={username}
                labelPlacement="column"
            />
            <Input 
                type="select"
                label="Account Type"
                required={true}
                placeholder="Select an account type"
                options={typeOptions}
                bind:value={accountType}
                labelPlacement="column"
            />
            <Input 
                type="multi"
                label="Tech Stack"
                required={true}
                options={techOptions}
                bind:value={techStack}
                labelPlacement="column"
            />
        </div>

        <div class="card modifiers-section">
            <h3>2. Button Modifiers</h3>
            <div class="modifier-row"> <label for="variant-select">Color (Variant):</label>
                <select id="variant-select" bind:value={selectedVariant}>
                    <option value="primary">Primary</option>
                    <option value="danger">Danger (Red)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Yellow)</option>
                </select>
            </div>
            <div class="modifier-row"> <label>
                    <input type="checkbox" bind:checked={isOutline} />
                    Outline Style (transparent border)
                </label>
            </div>
            <div class="modifier-row"> <label for="state-select">Form State (State):</label>
                <select id="state-select" bind:value={currentFormState}>
                    <option value="default">Default</option>
                    <option value="disabled">Disabled</option>
                    <option value="loading">Loading</option>
                </select>
            </div>
        </div>
    </div>

    <div class="card showcase-panel">
        <h3>3. Interactive Playground (Live Output)</h3>
        
        <div class="preview-box">
            <Button 
                type="submit"
                variant={selectedVariant}
                outline={isOutline}
                Inputstate={currentFormState}
                size="lg"
                rounded="md"
                onClick={handleFormSubmit}
            >
                {#if currentFormState === 'loading'}
                    Processing...
                {:else}
                    Submit form for: {username || '(Empty Username)'} 🚀
                {/if}
            </Button>
        </div>

        <div class="data-log">
            <strong>Current Form Values:</strong>
            <pre>Username: "{username}" | Type: "{accountType}" | Stack: {JSON.stringify(techStack)}</pre>
        </div>
    </div>

    <div class="card table-section" style="margin-top: 24px;">
        <h3>4. Table Component Demo</h3>
        <Table
            columns={tableColumns}
            data={paginatedTableData}
            totalItems={paginatedTableData.length}
            currentPage={tableCurrentPage}
            pageSize={tablePageSize}
            selectedIds={tableSelectedIds}
            isChecked={true}
            onPaging={handleTablePaging}
            onPageSizeChange={handleTablePageSizeChange}
            onSelectAll={handleTableSelectAll}
            onSelectRow={handleTableSelectRow}
        />
        <div class="table-info" style="margin-top: 16px;">
            <strong>Selected Rows:</strong> {tableSelectedIds.length > 0 ? tableSelectedIds.join(', ') : 'None'}
        </div>
    </div>
</main>

<Modal 
    bind:isOpen={isModalOpen}
    title="Account Created Successfully! 🎉"
    size="md"
    onConfirm={handleModalConfirm}
    onCancel={handleModalCancel}
>
    <div class="modal-content">
        <p><strong>Welcome, {username || 'New User'}!</strong></p>
        <p>Your account has been created successfully.</p>
        <ul>
            <li><strong>Username:</strong> {username}</li>
            <li><strong>Account Type:</strong> {accountType || 'Not selected'}</li>
            <li><strong>Tech Stack:</strong> {techStack.length > 0 ? techStack.join(', ') : 'Not selected'}</li>
        </ul>
        <p>You can now start exploring the platform!</p>
    </div>
</Modal>

<style is:global>
    .modal-content {
        text-align: left;
    }
    .modal-content p {
        margin: 0 0 12px 0;
    }
    .modal-content ul {
        list-style: none;
        padding: 0;
        margin: 16px 0;
    }
    .modal-content li {
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
    }
    .modal-content li:last-child {
        border-bottom: none;
    }
    .test-page {
        max-width: 1000px;
        margin: 40px auto;
        padding: 0 20px;
        font-family: system-ui, -apple-system, sans-serif;
        color: #1e293b;
    }
    .subtitle {
        color: #64748b;
        margin-top: -8px;
        margin-bottom: 32px;
    }
    .demo-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 24px;
    }
    .card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    h2, h3 {
        margin-top: 0;
    }
    h3 {
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 12px;
        margin-bottom: 20px;
        color: #475569;
    }
    .modifier-row {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .modifier-row select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
    }
    .modifier-row label {
        font-size: 14px;
        font-weight: 500;
    }
    .showcase-panel {
        text-align: center;
        background: #fafafa;
        margin-top: 24px;
    }
    .preview-box {
        padding: 32px;
        background: #ffffff;
        border: 2px dashed #e2e8f0;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
    }
    .data-log {
        text-align: left;
        background: #0f172a;
        color: #38bdf8;
        padding: 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 13px;
    }
    .data-log strong {
        color: #94a3b8;
        display: block;
        margin-bottom: 4px;
    }
    pre {
        margin: 0;
    }
    .table-section {
        margin-top: 24px;
    }
    .table-info {
        margin-top: 16px;
        padding: 12px;
        background: #f1f5f9;
        border-radius: 6px;
        font-size: 13px;
        color: #475569;
    }
</style>