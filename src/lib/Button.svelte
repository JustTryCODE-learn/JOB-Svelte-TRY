<script lang="ts">
	import type { Snippet } from "svelte";

	type Options = {
		outline?: boolean;
		className?: string;
		Inputstate?: 'loading'|'disabled'|'default';
		type: 'submit' | 'reset' | 'button';
		rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		size: '2xs' |'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'surface' | 'light' | 'dark' | 'transparent';
		children?: Snippet;
		onClick?: (event: MouseEvent) => void;
	}; 
	let {
		outline = false,
		className = '',
		Inputstate = 'default',
		type = 'button',
		rounded = 'md',
		size = 'md',
		variant = 'primary',
		children,
		onClick
	}: Options = $props();
	const Paddingsizes = {
		'2xs': '4px 8px',
		xs: '6px 12px',
        sm: '8px 14px',
        md: '10px 18px',
        lg: '12px 22px',
        xl: '14px 26px',
        '2xl': '16px 32px',
        full: '12px'
	};
	const Fontsizes = {
		'2xs': '11px',
        xs: '12px',
        sm: '13px',
        md: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        full: '16px'
	};
	let isClicking = $state(false);
	function handleClick(event: MouseEvent) {
        if (Inputstate === 'disabled' || Inputstate === 'loading' || isClicking) {
            event.preventDefault();
            return;
        }
        if (onClick) onClick(event);

        isClicking = true;
        setTimeout(() => {
			isClicking = false;
		}, 400);
	}
</script>

<button
	{type}
	class={`btn variant-${variant} rounded-${rounded} ${Inputstate} ${className}`}
	class:is-outline={outline}
	style={`
		padding: ${Paddingsizes[size] || '10px 18px'};
		font-size: ${Fontsizes[size] || '14px'};
		width: ${size === 'full' ? '100%' : 'auto'};
	`}
	disabled={Inputstate === 'disabled' || Inputstate === 'loading'}
	onclick={handleClick}
>
	{#if Inputstate === 'loading'} 
		<span class="spinner-icon">⏳</span>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		gap: 8px;
		font-family: system-ui, -apple-system, sans-serif;
		font-weight: 500;
		transition: all 0.2s ease;
		border: 1px solid transparent;
		box-sizing: border-box;
		user-select: none;
	}
	.rounded-xs   { border-radius: 2px; }
    .rounded-sm   { border-radius: 4px; }
    .rounded-md   { border-radius: 6px; }
    .rounded-lg   { border-radius: 8px; }
    .rounded-xl   { border-radius: 12px; }
    .rounded-2xl  { border-radius: 16px; }
    .rounded-full { border-radius: 9999px; }
	.variant-primary     { background-color: #3b82f6; color: white; }
    .variant-secondary   { background-color: #64748b; color: white; }
    .variant-success     { background-color: #22c55e; color: white; }
    .variant-danger      { background-color: #ef4444; color: white; }
    .variant-warning     { background-color: #eab308; color: #0f172a; }
    .variant-info        { background-color: #06b6d4; color: white; }
    .variant-surface     { background-color: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
    .variant-light       { background-color: #f8fafc; color: #334155; border-color: #e2e8f0; }
    .variant-dark        { background-color: #0f172a; color: white; }
    .variant-transparent { background-color: transparent; color: #0f172a; }

	.btn:hover:not(:disabled) {
		opacity: 0.8;
		transform: translateY(-1px);
	}
	.btn:active:not(::after) {
		transform: trnaslateY(1px)();
	}
	.is-outline {
		background-color: transparent !important;
	}
	.is-outline.variant-primary     { border-color: #3b82f6; color: #3b82f6; }
    .is-outline.variant-secondary   { border-color: #64748b; color: #64748b; }
    .is-outline.variant-success     { border-color: #22c55e; color: #22c55e; }
    .is-outline.variant-danger      { border-color: #ef4444; color: #ef4444; }
    .is-outline.variant-warning     { border-color: #eab308; color: #eab308; }
    .is-outline.variant-info        { border-color: #06b6d4; color: #06b6d4; }
    .is-outline.variant-surface     { border-color: #cbd5e1; color: #64748b; }
    .is-outline.variant-light       { border-color: #cbd5e1; color: #64748b; }
    .is-outline.variant-dark        { border-color: #0f172a; color: #0f172a; }
    .is-outline.variant-transparent { border-color: transparent; color: #0f172a; }

	.is-outline:hover:not(:disabled) {
        background-color: rgba(15, 23, 42, 0.04) !important;
        opacity: 1;
	}
	.disabled, .btn:disabled {
        background-color: #cbd5e1 !important;
        color: #94a3b8 !important;
        border-color: #cbd5e1 !important;
        cursor: not-allowed !important;
        transform: none !important;
        opacity: 1 !important;
    }
	.loading {
        cursor: wait !important;
        opacity: 0.7 !important;
        transform: none !important;
    }
	
    .spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>