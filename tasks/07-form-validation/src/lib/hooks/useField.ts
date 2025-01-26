import { writable, derived, type Writable } from 'svelte/store';
import type { FieldConfig, FieldState, ValidationError } from '../types/form';

// TODO: Улучшить хук для поля
// Простого store недостаточно.
// Изучи паттерны для field management.
// Подумай о производительности.

export function useField<T>(config: FieldConfig<T>) {
    // TODO: Улучшить state management
    // Простого объекта недостаточно.
    // Изучи иммутабельность.
    // Подумай о вложенных обновлениях.
    const state: Writable<FieldState> = writable({
        value: config.value,
        initial: config.value,
        touched: false,
        dirty: false,
        valid: true,
        errors: [],
        pending: false,
        dependencies: config.dependencies || []
    });

    // TODO: Улучшить валидацию
    // Простого перебора недостаточно.
    // Изучи асинхронность.
    // Подумай о параллельной валидации.
    function validate(value: T): ValidationError[] {
        return config.validators.reduce((errors, validator) => {
            return errors.concat(validator.validate(value));
        }, [] as ValidationError[]);
    }

    // TODO: Добавить async validation
    // Promise.all недостаточно.
    // Изучи AbortController.
    // Подумай о race conditions.
    async function validateAsync(value: T): Promise<ValidationError[]> {
        if (!config.asyncValidators) return [];
        
        const results = await Promise.all(
            config.asyncValidators.map(validator => validator.validate(value))
        );
        
        return results.flat();
    }

    // TODO: Улучшить обновление
    // Простого set недостаточно.
    // Изучи транзакции.
    // Подумай о rollback.
    function setValue(value: T) {
        state.update(s => ({
            ...s,
            value,
            dirty: value !== s.initial
        }));
        
        // TODO: Добавить debounce
        // setTimeout недостаточно.
        // Изучи RxJS patterns.
        // Подумай о cancel.
        validateField();
    }

    // TODO: Улучшить touch
    // Простого флага недостаточно.
    // Изучи UX patterns.
    // Подумай о focus management.
    function setTouched(touched: boolean = true) {
        state.update(s => ({ ...s, touched }));
        if (touched) validateField();
    }

    // TODO: Улучшить reset
    // Простого присваивания недостаточно.
    // Изучи form lifecycle.
    // Подумай о side effects.
    function reset() {
        state.update(s => ({
            ...s,
            value: s.initial,
            touched: false,
            dirty: false,
            errors: [],
            pending: false
        }));
    }

    // TODO: Улучшить validateField
    // Простой последовательности недостаточно.
    // Изучи error management.
    // Подумай о partial validation.
    async function validateField() {
        state.update(s => ({ ...s, pending: true }));
        
        const syncErrors = validate(state.get().value);
        const asyncErrors = await validateAsync(state.get().value);
        
        state.update(s => ({
            ...s,
            errors: [...syncErrors, ...asyncErrors],
            valid: syncErrors.length + asyncErrors.length === 0,
            pending: false
        }));
    }

    return {
        subscribe: state.subscribe,
        set: setValue,
        touch: setTouched,
        reset,
        validate: validateField
    };
}
