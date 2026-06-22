<script lang="ts">
	type Options = {
		type?: 'text' | 'number' | 'select' | 'multi';
		label?: string;
		labelPlacement?: 'row' | 'column';
		value?: string | string[];
		onChange?: (value: string | string[]) => void;
		options?: { label: string; value: string }[];
		placeholder?: string;
		required?: boolean;
		Inputstate?: 'disabled' | 'readonly' | 'loading' | '';
		icon?: string;
		iconPlacement?: 'start' | 'end';
		className?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	};
	let {
		type = 'text',
		label = '',
		labelPlacement = 'row',
		value = $bindable(''),
		onChange,
		options = [],
		placeholder = '',
		required = false,
		Inputstate = '',
		icon = '',
		iconPlacement = 'end',
		className = '',
		size = 'md'
	}: Options = $props();
	let error = $state('');
	const inputId = crypto.randomUUID();
	const sizes = {
		xs: '24px',
		sm: '32px',
		md: '36px',
		lg: '48px',
		xl: '56px'
	};
	function validate(val: string | string[]) {
		if (required) {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				error = 'Cannot be empty!';
				return false;
			}
		}
		error = '';
		return true;
	}
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement|HTMLSelectElement;
		let newValue: string | string[] = target.value;
		if (type === 'multi' && target instanceof HTMLSelectElement) {
			newValue = Array.from(target.selectedOptions).map(o => o.value);
		}
        value = newValue;
        validate(newValue);
        if (onChange) onChange(newValue);
	}
</script>

<div class="input-container-block">
    <div class={`container ${labelPlacement} ${className}`}>
        {#if label}
            <label class="label" for={inputId}>
                {label}
                {#if required} <span class="required">*</span>{/if}
            </label>
        {/if}
        
        <div class={`input-wrapper ${Inputstate}`} style={`height: ${sizes[size]};`}>
            {#if icon && iconPlacement === 'start' && Inputstate !== 'loading'}
                <span class="icon start-icon">{icon}</span>
            {/if}
            {#if Inputstate === 'loading' && iconPlacement === 'start'}
                <span class="spinner-icon">⏳</span>
            {/if}

            {#if type === 'select'}
                <select id={inputId} value={value as string} onchange={handleInput} disabled={Inputstate === 'disabled' || Inputstate === 'loading'}>
                    <option value="" disabled selected>{placeholder || 'Select an option'}</option>
                    {#each options as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            {:else if type === 'multi'}
                <select id={inputId} multiple value={value as string[]} onchange={handleInput} disabled={Inputstate === 'disabled' || Inputstate === 'loading'}>
                    {#each options as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            {:else}
                <input
                    id={inputId}
                    type={type}
                    value={value as string}
                    oninput={handleInput}
                    {placeholder}
                    disabled={Inputstate === 'disabled' || Inputstate === 'loading'}
                    readonly={Inputstate === 'readonly'}
                    style={icon ? (iconPlacement === 'start' ? 'padding-left: 36px;' : 'padding-right: 36px;') : ''}
                />
            {/if}

            {#if icon && iconPlacement === 'end' && Inputstate !== 'loading'}
                <span class="icon end-icon">{icon}</span>
            {/if}
            {#if Inputstate === 'loading' && iconPlacement === 'end'}
                <span class="spinner-icon">⏳</span>
            {/if}
        </div>
    </div>

    {#if error}
        <p class="error-text" style={labelPlacement === 'row' ? 'margin-left: 108px;' : ''}>
            {error}
        </p>
    {/if}
</div>

<style>
    .input-container-block {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 16px;
    }

    .container {
        display: flex;
        gap: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        width: 100%;
    }

    .row {
        flex-direction: row;
        align-items: center;
    }

    .column {
        flex-direction: column;
        align-items: flex-start;
    }

    .label {
        font-size: 14px;
        font-weight: 500;
        min-width: 100px;
        color: #374151;
        user-select: none;
    }

    .required {
        color: #ef4444;
        margin-left: 2px;
    }

    .input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
    }

    input, select {
        width: 100%;
        height: 100%;
        padding: 6px 12px;
        font-size: 14px;
        color: #1f2937;
        background-color: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        box-sizing: border-box;
        transition: border-color 0.15s ease;
    }

    input:focus, select:focus {
        outline: none;
        border-color: #3b82f6;
    }

    select[multiple] {
        height: auto;
        min-height: 80px;
        padding: 6px;
    }

    .input-wrapper.disabled input,
    .input-wrapper.disabled select {
        background-color: #f1f5f9;
        color: #94a3b8;
        cursor: not-allowed;
    }

    .input-wrapper.readonly input {
        background-color: #f8fafc;
        border-style: dashed;
    }

    .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        color: #64748b;
        pointer-events: none;
        display: flex;
        align-items: center;
    }

    .start-icon {
        left: 12px;
    }

    .end-icon {
        right: 12px;
    }

    .spinner-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        animation: spin 1s infinite linear;
    }
    
    .input-wrapper:has(.start-icon) .spinner-icon { left: 12px; }
    .input-wrapper:has(.end-icon) .spinner-icon { right: 12px; }

    @keyframes spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
    }

    .error-text {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        margin-bottom: 0;
        font-weight: 500;
    }
</style>