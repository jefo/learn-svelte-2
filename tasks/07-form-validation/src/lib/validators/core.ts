import type { Validator, ValidationError, AsyncValidator } from '../types/form';

// TODO: Реализовать базовые валидаторы
// Простых проверок недостаточно.
// Изучи паттерны для validation rules.
// Подумай о композиции правил.

export function required(): Validator {
    // TODO: Улучшить required validator
    // Простой проверки на null недостаточно.
    // Изучи edge cases для разных типов.
    // Подумай о кастомных сообщениях.
    return {
        validate: (value: any) => {
            if (value == null || value === '') {
                return [{
                    type: 'required',
                    message: 'This field is required'
                }];
            }
            return [];
        }
    };
}

export function minLength(length: number): Validator {
    // TODO: Улучшить minLength validator
    // Простой проверки length недостаточно.
    // Изучи Unicode и многобайтовые символы.
    // Подумай о разных типах значений.
    return {
        validate: (value: any) => {
            if (value?.length < length) {
                return [{
                    type: 'minLength',
                    message: `Minimum length is ${length}`,
                    params: { length }
                }];
            }
            return [];
        }
    };
}

// TODO: Добавить async validator factory
// Promise.resolve недостаточно.
// Изучи AbortController.
// Подумай о retry logic.
export function asyncValidator(
    fn: (value: any) => Promise<ValidationError[]>,
    options: { debounce?: number; cache?: boolean } = {}
): AsyncValidator {
    // TODO: Улучшить async validation
    // Простого debounce недостаточно.
    // Изучи race conditions.
    // Подумай о кэшировании результатов.
    return {
        validate: fn,
        debounce: options.debounce,
        cache: options.cache
    };
}

// TODO: Реализовать композицию валидаторов
// Array.prototype.concat недостаточно.
// Изучи паттерны для validator composition.
// Подумай о порядке выполнения.
export function compose(...validators: Validator[]): Validator {
    // TODO: Улучшить композицию
    // Простого перебора недостаточно.
    // Изучи монады и функторы.
    // Подумай о short-circuit evaluation.
    return {
        validate: (value: any) => {
            return validators.reduce((errors, validator) => {
                return errors.concat(validator.validate(value));
            }, [] as ValidationError[]);
        }
    };
}

// TODO: Добавить conditional validator
// Простого if недостаточно.
// Изучи паттерны для conditional logic.
// Подумай о зависимостях полей.
export function when(
    condition: (value: any) => boolean,
    validator: Validator
): Validator {
    // TODO: Улучшить условную валидацию
    // Простой функции недостаточно.
    // Изучи паттерны для dynamic validation.
    // Подумай о производительности.
    return {
        validate: (value: any) => {
            return condition(value) ? validator.validate(value) : [];
        }
    };
}
