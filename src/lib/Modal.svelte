<script lang="ts">
    import type { Snippet } from 'svelte';
    import Button from '$lib/Button.svelte';

    type ButtonVariant = | 'primary'	| 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'surface' | 'light'	| 'dark' | 'transparent';

    type ActionButton = {
        id: string;
        label: string;
        onClick: () => void;
        variant?: ButtonVariant;
    };

    type Options = {
        size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
        title?: string;
        isOpen?: boolean;
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
        title = '',
        isOpen = $bindable(false), 
        cancelLabel = 'Cancel',
        confirmLabel = 'Confirm',
        actionChildren,
        actionButtons = [] as ActionButton[],
        onCancel,
        onConfirm,
        children
    }: Options = $props();
    const handleClose = () => {
        isOpen = false;
        onCancel?.();
    };
    const handleConfirm = () => {
        isOpen = false;
        onConfirm?.();
    };
    const handleBackdropClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {handleClose();}
    };
    const handleBackdropKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleClose();
        }
    };
    const modalTitleId = crypto.randomUUID();
    $effect(() => {
        if (!isOpen) return;
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    });
</script>

{#if isOpen}
	<div
        class="modal-backdrop"
        onclick={handleBackdropClick}
        onkeydown={handleBackdropKeydown}
        role="button"
        tabindex="0"
    >
		<div class={`modal-box size-${size}`} role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
			<header class="modal-header">
				<h3 id={modalTitleId}>{title}</h3>

				<button type="button" class="close-x-btn" onclick={handleClose} aria-label="Close modal">✕</button>
			</header>

			<main class="modal-body">
				{#if children}
					{@render children()}
				{/if}
			</main>

			<footer class="modal-footer">
				{#if actionChildren}
					{@render actionChildren()}
				{:else if actionButtons.length > 0}
					{#each actionButtons as button (button.id)}
						<Button variant={button.variant ?? 'primary'} onClick={button.onClick} type="button" size="md">
							{button.label}
						</Button>
					{/each}
				{:else}
					<Button variant="surface" onClick={handleClose} type="button" size="md">
						{cancelLabel}
					</Button>

					<Button	variant="primary" onClick={handleConfirm} type="button" size="md">
						{confirmLabel}
					</Button>
				{/if}
			</footer>
		</div>
	</div>
{/if}

<style>
    .modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		z-index: 1000;
	}

    .modal-box {
		background-color: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-height: 90vh;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		animation: modal-scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

    @keyframes modal-scale-up {
		from {transform: scale(0.95); opacity: 0;}
		to {transform: scale(1); opacity: 1;}
	}

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid #e2e8f0;
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
        line-height: 1.5;
        color: #475569;
    }

    .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
    }

    .close-x-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 4px;
		font-size: 18px;
		color: #64748b;
		transition: color 0.2s ease;
	}

    .close-x-btn:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }

    .size-sm { width: 100%; max-width: 400px; }
    .size-md { width: 100%; max-width: 560px; }
    .size-lg { width: 100%; max-width: 800px; }
    .size-xl { width: 100%; max-width: 1140px; }
    .size-2xl { width: 100%; max-width: 1400px; }
    .size-full { width: 100vw; height: 100vh; max-height: 100vh; border-radius: 0; }
</style>