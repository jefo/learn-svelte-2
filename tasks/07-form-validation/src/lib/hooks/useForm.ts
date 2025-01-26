import { writable, derived, get, type Writable } from 'svelte/store';
import type { FormState, FieldConfig, ValidationError } from '../types/form';
import { useField } from './useField';

// TODO: Улучшить form management
// Простого объекта недостаточно.
// Изучи паттерны для form state.
// Подумай о масштабируемости.

interface FormConfig {
    fields: Record<string, FieldConfig<any>>;
    onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

// TODO: Улучшить form hook
// Простого store недостаточно.
// Изучи паттерны для form management.
// Подумай о производительности.
export function useForm(config: FormConfig) {
    // TODO: Улучшить fields management
    // Map недостаточно.
    // Изучи структуры данных.
    // Подумай о memory usage.
    const fields = new Map(
        Object.entries(config.fields).map(([name, fieldConfig]) => [
            name,
            useField(fieldConfig)
        ])
    );

    // TODO: Улучшить form state
    // Простого объекта недостаточно.
    // Изучи иммутабельность.
    // Подумай о updates batching.
    const formState: Writable<FormState> = writable({
        valid: true,
        dirty: false,
        touched: false,
        submitted: false,
        errors: {}
    });

    // TODO: Улучшить values derivation
    // Простого reduce недостаточно.
    // Изучи memoization.
    // Подумай о производительности.
    const values = derived(
        Array.from(fields.values()),
        $fields => {
            return $fields.reduce((acc, field, index) => {
                const name = Array.from(fields.keys())[index];
                acc[name] = field.value;
                return acc;
            }, {} as Record<string, any>);
        }
    );

    // TODO: Улучшить validation
    // Promise.all недостаточно.
    // Изучи параллельную валидацию.
    // Подумай о partial validation.
    async function validate() {
        const validations = Array.from(fields.entries()).map(async ([name, field]) => {
            await field.validate();
            return [name, get(field).errors];
        });

        const results = await Promise.all(validations);
        const errors = Object.fromEntries(
            results.filter(([_, errors]) => errors.length > 0)
        );

        formState.update(s => ({
            ...s,
            valid: Object.keys(errors).length === 0,
            errors
        }));

        return Object.keys(errors).length === 0;
    }

    // TODO: Улучшить submit
    // Простого вызова недостаточно.
    // Изучи form submission patterns.
    // Подумай о error handling.
    async function handleSubmit(event?: Event) {
        event?.preventDefault();
        
        formState.update(s => ({ ...s, submitted: true }));
        
        const isValid = await validate();
        if (!isValid) return;

        if (config.onSubmit) {
            try {
                await config.onSubmit(get(values));
            } catch (error) {
                // TODO: Улучшить error handling
                // console.error недостаточно.
                // Изучи error boundaries.
                // Подумай о recovery.
                console.error('Form submission error:', error);
            }
        }
    }

    // TODO: Улучшить reset
    // Простого перебора недостаточно.
    // Изучи form lifecycle.
    // Подумай о side effects.
    function reset() {
        fields.forEach(field => field.reset());
        formState.set({
            valid: true,
            dirty: false,
            touched: false,
            submitted: false,
            errors: {}
        });
    }

    // TODO: Улучшить touch
    // Простого перебора недостаточно.
    // Изучи UX patterns.
    // Подумай о focus management.
    function touch() {
        fields.forEach(field => field.touch());
        formState.update(s => ({ ...s, touched: true }));
    }

    return {
        fields,
        state: { subscribe: formState.subscribe },
        values: { subscribe: values.subscribe },
        handleSubmit,
        reset,
        touch,
        validate
    };
}
