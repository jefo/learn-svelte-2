<script lang="ts">
    import { useForm } from '../hooks/useForm';
    import type { FormConfig } from '../types/form';
    
    // TODO: Улучшить пропсы
    // Простого конфига недостаточно.
    // Изучи паттерны для props API.
    // Подумай о DX.
    export let config: FormConfig;
    
    // TODO: Улучшить form management
    // Простого хука недостаточно.
    // Изучи паттерны для forms.
    // Подумай о контексте.
    const form = useForm(config);
    
    // TODO: Улучшить context
    // Простого setContext недостаточно.
    // Изучи паттерны для DI.
    // Подумай о типобезопасности.
    setContext('form', form);
</script>

<!-- TODO: Улучшить разметку -->
<!-- Простого form недостаточно. -->
<!-- Изучи доступность. -->
<!-- Подумай о кастомизации. -->
<form
    on:submit|preventDefault={form.handleSubmit}
    class="form"
    {...$$restProps}
>
    <slot {form} />
    
    <!-- TODO: Улучшить errors -->
    <!-- Простого списка недостаточно. -->
    <!-- Изучи UX patterns. -->
    <!-- Подумай о группировке. -->
    {#if $form.state.submitted && !$form.state.valid}
        <div class="form-errors" role="alert">
            {#each Object.entries($form.state.errors) as [field, errors]}
                <div class="field-errors">
                    <strong>{field}:</strong>
                    {#each errors as error}
                        <div class="error">{error.message}</div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</form>

<style>
    /* TODO: Улучшить стили */
    /* Простых классов недостаточно. */
    /* Изучи CSS-in-JS. */
    /* Подумай о темизации. */
    .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-errors {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #f00;
        border-radius: 4px;
        color: #f00;
    }
    
    .field-errors {
        margin: 0.5rem 0;
    }
    
    .error {
        margin-top: 0.25rem;
        font-size: 0.875rem;
    }
</style>
