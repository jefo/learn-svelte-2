<script lang="ts">
    import { getContext } from 'svelte';
    import type { ValidationError } from '../types/form';
    
    // TODO: Улучшить пропсы
    // Простых строк недостаточно.
    // Изучи паттерны для field props.
    // Подумай о кастомизации.
    export let name: string;
    export let label: string;
    
    // TODO: Улучшить form context
    // Простого getContext недостаточно.
    // Изучи паттерны для form state.
    // Подумай о типобезопасности.
    const form = getContext('form');
    const field = form.fields.get(name);
    
    // TODO: Улучшить error display
    // Простого массива недостаточно.
    // Изучи UX patterns.
    // Подумай о приоритетах ошибок.
    $: errors = $field?.errors || [];
    $: touched = $field?.touched || false;
    $: dirty = $field?.dirty || false;
    $: valid = $field?.valid ?? true;
    $: pending = $field?.pending || false;
    
    // TODO: Улучшить handlers
    // Простых функций недостаточно.
    // Изучи event patterns.
    // Подумай о производительности.
    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        field.set(target.value);
    }
    
    function handleBlur() {
        field.touch();
    }
</script>

<!-- TODO: Улучшить разметку -->
<!-- Простого div недостаточно. -->
<!-- Изучи доступность. -->
<!-- Подумай о кастомизации. -->
<div class="field" class:invalid={!valid && touched}>
    <label for={name} class="label">
        {label}
        {#if pending}
            <span class="pending">Validating...</span>
        {/if}
    </label>
    
    <slot
        name="input"
        {handleInput}
        {handleBlur}
        value={$field?.value}
        aria-invalid={!valid && touched}
        aria-describedby={errors.length ? `${name}-error` : undefined}
    >
        <!-- TODO: Улучшить input -->
        <!-- Простого input недостаточно. -->
        <!-- Изучи HTML5 inputs. -->
        <!-- Подумай о типах полей. -->
        <input
            {name}
            id={name}
            value={$field?.value}
            on:input={handleInput}
            on:blur={handleBlur}
            class="input"
            class:invalid={!valid && touched}
            aria-invalid={!valid && touched}
            aria-describedby={errors.length ? `${name}-error` : undefined}
            {...$$restProps}
        />
    </slot>
    
    <!-- TODO: Улучшить errors -->
    <!-- Простого div недостаточно. -->
    <!-- Изучи ARIA patterns. -->
    <!-- Подумай о анимации. -->
    {#if touched && errors.length > 0}
        <div
            class="errors"
            id={`${name}-error`}
            role="alert"
        >
            {#each errors as error}
                <div class="error">{error.message}</div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* TODO: Улучшить стили */
    /* Простых классов недостаточно. */
    /* Изучи CSS variables. */
    /* Подумай о dark mode. */
    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .label {
        font-weight: 500;
        color: #333;
    }
    
    .input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .input:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
    }
    
    .input.invalid {
        border-color: #f00;
    }
    
    .errors {
        color: #f00;
        font-size: 0.875rem;
    }
    
    .error {
        margin-top: 0.25rem;
    }
    
    .pending {
        margin-left: 0.5rem;
        font-size: 0.875rem;
        color: #666;
    }
</style>
