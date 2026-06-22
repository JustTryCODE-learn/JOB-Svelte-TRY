<script lang="ts">
    import type { Snippet } from 'svelte';
    import Button from '$lib/Button.svelte';

    type ActionButton = {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    };

    type Options = {
        size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
        title: string;
        isOpen: boolean;
        cancelLabel?: string;
        confirmLabel?: string;
        actionChildren?: Snippet;
        actionButtons?: ActionButton[];
        onCancel?: () => void;
        onConfirm?: () => void;
        children?: Snippet;
    };
    let {
        size = 'md',
        title,
        isOpen = $bindable(false), 
        cancelLabel = 'Cancel',
        confirmLabel = 'Confirm',
        actionChildren,
        actionButtons,
        onCancel,
        onConfirm,
        children
    }: Options = $props();
    function handleClose() {
        isOpen = false;
        if (onCancel) onCancel();   
    }
    function handleConfirm() {
        isOpen = false;
        if (onConfirm) onConfirm();
    }
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    }
</script>

{#if isOpen}
    <div class="modal-backdrop" onclick={handleBackdropClick} onkeydown={(e) => e.key === 'Escape' && handleClose()} role="button" tabindex="0">
        
        <div class={`modal-box size-${size}`}>
            
            <header class="modal-header">
                <h3>{title}</h3>
                <button class="close-x-btn" onclick={handleClose} aria-label="Close modal">✕</button>
            </header>

            <main class="modal-body">
                {#if children}
                    {@render children()}
                {/if}
            </main>

            <footer class="modal-footer">
                {#if actionChildren}
                    {@render actionChildren()}
                {:else if actionButtons && actionButtons.length > 0}
                    {#each actionButtons as btn}
                        <Button variant={btn.variant || 'primary'} onClick={btn.onClick} type="button" size="md">
                            {btn.label}
                        </Button>
                    {/each}
                {:else}
                    <Button variant="surface" onClick={handleClose} type="button" size="md">
                        {cancelLabel}
                    </Button>
                    <Button variant="primary" onClick={handleConfirm} type="button" size="md">
                        {confirmLabel}
                    </Button>
                {/if}
            </footer>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-box {
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        max-height: 90vh; 
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        animation: modalScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes modalScaleUp {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid #e2e8f0;
        background: white;
    }
    .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #1e293b;
    }
    .modal-body {
        padding: 24px;
        overflow-y: auto;
        font-size: 15px;
        color: #4a5568;
        line-height: 1.5;
    }
    .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
        background: white;
    }
    .close-x-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 18px;
        color: #64748b;
        transition: color 0.2s ease;
        padding: 4px;
    }
    .close-x-btn:hover {
        color: #1e293b;
    }
    .size-sm   { width: 100%; max-width: 400px; }
    .size-md   { width: 100%; max-width: 560px; }
    .size-lg   { width: 100%; max-width: 800px; }
    .size-xl   { width: 100%; max-width: 1140px; }
    .size-2xl  { width: 100%; max-width: 1400px; }
    .size-full { width: 100vw; height: 100vh; max-height: 100vh; border-radius: 0; }
</style>