<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Modal from '$lib/Modal.svelte';
	import Table from '$lib/Table.svelte';
    import Forms from '$lib/Forms.svelte';
	import { formHasErrors, validateAccountForm } from '$lib/validation';

	let form = $state({
        username: "",
        accountType: "",
        techStack: ""
    });
    let errors = $state({
        username: "",
        accountType: "",
        techStack: ""
    });

	type ButtonVariant =
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'surface'
        | 'light'
        | 'dark'
        | 'transparent';
        
    let selectedVariant = $state<ButtonVariant>('primary');
	let isOutline = $state(false);
	let currentFormState = $state<'default' | 'loading' | 'disabled'>('default');

	let isModalOpen = $state(false);

	let tableCurrentPage = $state(1);
	let tablePageSize = $state(10);
	let tableSelectedIds = $state<string[]>([]);
	
	const tableColumns = [
		{ key: 'name', label: 'Username', width: '200px' },
		{ key: 'accountType', label: 'Account Type', width: '150px' },
		{ key: 'techStack', label: 'Tech Stack', width: '250px' },
        { key: 'accountState', label: 'Account State', width: '150px' }
	];

	let tableData = $state<Array<{ id: string; name: string; accountType: string; techStack: string; accountState: string }>>([]);

	let paginatedTableData = $derived(tableData.slice(
		(tableCurrentPage - 1) * tablePageSize,
		tableCurrentPage * tablePageSize
	));

    let selectedUsernames = $derived(tableData.filter(row => tableSelectedIds.includes(row.id)).map(row => row.name));
	
    let pendingAccount : { id: string; name: string; accountType: string; techStack: string; accountState: string} | null = null;

	const typeOptions = [
		{label: 'Personal', value: 'personal'},
		{label: 'Business', value: 'business'}
	];

	const techOptions = [
		{label: 'React', value: 'react'},
		{label: 'Svelte', value: 'svelte'},
		{label: 'Vue', value: 'vue'}
	];

    const isSubmitDisabled = $derived(
        formHasErrors(errors) ||
        !form.username.trim() ||
        !form.accountType ||
        !form.techStack
    );

	function handleFormSubmit() {
		if (!validateForm()) return;
        currentFormState = 'loading';
		setTimeout(() => {
			currentFormState = 'default';
			pendingAccount = {
				id: String(Date.now()), 
				name: form.username,
				accountType: form.accountType,
				techStack: form.techStack,
                accountState: selectedVariant
			};
			isModalOpen = true;
		}, 2000);
	}

	function handleModalConfirm() {
        form = {
            username: "",
            accountType: "",
            techStack: ""
        };
        errors = { username: '', accountType: '', techStack: '' };
        if (pendingAccount) {
            tableData = [...tableData, pendingAccount];
            console.log('added account:', pendingAccount);
            pendingAccount = null;
        }
	}

	function handleModalCancel() {
        pendingAccount = null;
		console.log('Modal cancelled');
	}

	function handleTablePaging(page: number) {
		tableCurrentPage = page;
		console.log('Page changed to:', page);
	}

	function handleTablePageSizeChange(size: number) {
		tablePageSize = size;
		tableCurrentPage = 1;
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

    function validateForm() {
        errors = validateAccountForm(form, tableData);
        return !formHasErrors(errors);
    }

    function validateUsername() {
        const nextErrors = validateAccountForm(form, tableData);
        errors.username = nextErrors.username;
    }

    $effect(() => {
        validateUsername();
    })
</script>

<main class="test-page">
    <a class="back-link" href="/">← back</a>
    <h2>Components demo</h2>
    <p class="subtitle">test input, button, modal, table + form validation</p>

    <div class="demo-layout">
    
        <div class="card input-section">
            <h3>1. Input Component</h3>
            <Forms title="Account Registration Form" onSubmit={handleFormSubmit}>
                {#snippet children()}
                    <Input 
                        label="Username"
                        bind:value={form.username}
                        err={errors.username}
                    />
                    <Input 
                        label="Account"
                        type="select"
                        bind:value={form.accountType}
                        options={typeOptions}
                        err={errors.accountType}
                    />
                    <Input 
                        label="Tech Stack"
                        type="select"
                        bind:value={form.techStack}
                        options={techOptions}
                        err={errors.techStack}
                    />
                {/snippet}
            </Forms>
        </div>

        <div class="card modifiers-section">
            <h3>2. Button Modifiers</h3>
            <div class="modifier-row"> <label for="variant-select">Account State:</label>
                <select id="variant-select" bind:value={selectedVariant}>
                    <option value="primary">Primary</option>
                    <option value="danger">Danger</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                </select>
            </div>
            <div class="modifier-row"> <label>
                    <input type="checkbox" bind:checked={isOutline} />
                    Outline Style (transparent border)
                </label>
            </div>
            <div class="modifier-row"> <label for="state-select">Form State:</label>
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
                inputState={currentFormState}
                size="lg"
                rounded="md"
                onClick={handleFormSubmit}
                disabled={isSubmitDisabled}
            >
                {#if currentFormState === 'loading'}
                    Processing...
                {:else}
                    Submit form for: {form.username || '(Empty Username)'} 🚀
                {/if}
            </Button>
        </div>

        <div class="data-log">
            <strong>Current Form Values:</strong>
            <pre>Username: "{form.username}" | Type: "{form.accountType}" | Stack: {JSON.stringify(form.techStack)} | State: "{selectedVariant}"</pre>
        </div>
    </div>

    <Modal 
        bind:isOpen={isModalOpen}
        title="Account Created Successfully! 🎉"
        size="md"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
    >
        <div class="modal-content">
            <p><strong>Welcome, {form.username || 'New User'}!</strong></p>
            <p>Your account has been created successfully.</p>
            <ul>
                <li><strong>Username:</strong> {form.username}</li>
                <li><strong>Account Type:</strong> {form.accountType || 'Not selected'}</li>
                <li><strong>Tech Stack:</strong> {form.techStack || 'Not selected'}</li>
                <li><strong>Account State:</strong> {selectedVariant}</li>
            </ul>
            <p>Choose "Confirm" to have the ability to use the platform!</p>
        </div>
    </Modal>

    <div class="card table-section" style="margin-top: 24px;">
        <h3>4. Table Component Demo</h3>
        <Table
            columns={tableColumns}
            data={paginatedTableData}
            totalItems={tableData.length}
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
            <strong>Selected Username(s):</strong> {selectedUsernames.length > 0 ? selectedUsernames.join(', ') : 'None'}
        </div>
    </div>

</main>

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
    .back-link {
        display: inline-block;
        color: #2563eb;
        font-weight: 600;
        margin-bottom: 12px;
        text-decoration: none;
    }
</style>
