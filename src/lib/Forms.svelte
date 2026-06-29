<script lang="ts">
    type Props = {
        title?: string;
        onSubmit?: (event: SubmitEvent) => void;
        children?: any;
    };

    let {
        title = "Form Component",
        onSubmit = () => {},
        children
    }: Props = $props();

    function submit(event: SubmitEvent) {
        event.preventDefault();
        onSubmit(event);
    }
</script>

<div class="form-card">
    <h2>{title}</h2>
    <form onsubmit={submit}>
        {@render children?.()}
    </form>
</div>

<style>
    .form-card {
        border: 2px solid #4f46e5;
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
        background: #f8faff;
    }

    .form-card h2 {
        margin-bottom: 16px;
        color: #4f46e5;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
</style>