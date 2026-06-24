<script lang="ts">
    import Button from '$lib/Button.svelte';

    export type TableColumn = {
        key: string;
        label: string;
        width?: string;
    };

    type TableRow = {
        id: string;
        [key: string]: unknown;
    };

    type Options = {
        selectedIds?: string[];
        isChecked?: boolean;
        pageSize?: number;
        totalItems?: number;
        currentPage?: number;
        columns?: TableColumn[];
        data?: TableRow[];
        onPaging?: (page: number) => void;
        onPageSizeChange?: (size: number) => void;
        onSelectAll?: () => void;
        onSelectRow?: (id: string) => void;
    };
    let {
        selectedIds = [],
        isChecked = false,
        pageSize = 10,
        totalItems = 0,
        currentPage = 1,
        columns = [],
        data = [],
        onPaging,
        onPageSizeChange,
        onSelectAll,
        onSelectRow
    }: Options = $props();

    let totalPages = $derived(Math.ceil(totalItems / pageSize) || 1);
    let isAllChecked = $derived(data.length > 0 && data.every(row => selectedIds.includes(row.id)));

    function handleSelectAllChange() {
        onSelectAll?.();
    }

    function handleRowSelectChange(id: string) {
        onSelectRow?.(id);
    }
    function changePage(newPage: number) {
        if (newPage >= 1 && newPage <= totalPages && onPaging) {
            onPaging(newPage);
        }
    }
    function handleSizeChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        if (onPageSizeChange) {
            onPageSizeChange(Number(select.value));
        }
    }
</script>

<div class="table-container">
    <div class="table-scroll-wrapper">
        <table class="custom-table">
            <thead>
                <tr>
                    {#if isChecked} 
                        <th class="checkbox-col">
                            <input
                                type="checkbox"
                                aria-label="Select all rows"
                                checked={isAllChecked}
                                onchange={handleSelectAllChange}
                            />
                        </th>
                    {/if}
                    {#each columns as column}
                        <th style={column.width ? `width: ${column.width}` : ''}>{column.label}</th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#if data.length === 0}
                    <tr>
                        <td colspan={columns.length + (isChecked ? 1 : 0)} class="empty-cell">
                            <div class="empty-state">
                                <span class="empty-icon">📁</span>
                                <p>No data available</p>
                            </div>
                        </td>
                    </tr>
                {:else}
                    {#each data as row (row.id)}
                        <tr class:row-selected={selectedIds.includes(row.id)}>
                            {#if isChecked}
                                <td class="checkbox-col">
                                    <input
                                        type="checkbox"
                                        aria-label={`Select row ${row.id}`}
                                        checked={selectedIds.includes(row.id)}
                                        onchange={() => handleRowSelectChange(row.id)}
                                    />
                                </td>
                            {/if}
                            {#each columns as column}
                                <td>{row[column.key] ?? ''}</td>
                            {/each}
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
    
    <div class="table-pagination">
        <div class="pagination-info">
            Total: <strong>{totalItems}</strong> lines | Display records:
            <select class="size-select" value={pageSize} onchange={handleSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>
            <span class="current-page">Page: {currentPage} of {totalPages}</span>
        </div>
        <div class="pagination-controls">
            <Button 
                type="button"
                variant="light" 
                size="sm" 
                rounded="md" 
                inputState={currentPage === 1 ? 'disabled' : 'default'}
                onClick={() => changePage(currentPage - 1)}
            >
                ◀ Previous
            </Button>

            <span class="page-indicator">
                {currentPage} of {totalPages}
            </span>

            <Button 
                type="button"
                variant="light" 
                size="sm" 
                rounded="md" 
                inputState={currentPage === totalPages ? 'disabled' : 'default'}
                onClick={() => changePage(currentPage + 1)}
            >
                Next ▶
            </Button> 
        </div>
    </div>
</div>

<style>
    .table-container {
        width: 100%;
        background-color: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, sans-serif;
    }
    .table-scroll-wrapper {
        width: 100%;
        overflow-x: auto;    
    }

    .custom-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: 14px;
    }
    .custom-table th {
        background-color: #f8fafc;
        color: #475569;
        font-weight: 600;
        padding: 12px 16px;
        border-bottom: 2px solid #e2e8f0;
        white-space: nowrap;
        user-select: none;
    }
    .custom-table td {
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
        color: #334155;
    }
    .custom-table tbody tr{
        transition: background-color 0.2s ease;
    }
    .custom-table tbody tr:hover {
        background-color: #f1f5f9;
    }
    .custom-table tbody tr.row-selected {
        background-color: #eff6ff;   
    }  

    .checkbox-col {
        width: 40px;
        text-align: center;
        padding-right: 0 !important;
    }
    .checkbox-col input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
    }
    .empty-cell {
        padding: 0 !important;
    }
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        color: #94a3b8;
        background: #fafafa;
    }
    .empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
    }
    .empty-state p {
        margin: 0;
        font-size: 15px;
        font-weight: 500;
    }
    
    .table-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: #f8fafc;
        border-top: 1px solid #e2e8f0;
        font-size: 13px;
        color: #64748b;
        flex-wrap: wrap;
        gap: 12px;
    }
    .size-select {
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        background-color: white;
        color: #334155;
        font-weight: 500;
        cursor: pointer;
    }
    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .page-indicator {
        font-weight: 500;
        color: #334155;
    }
</style>