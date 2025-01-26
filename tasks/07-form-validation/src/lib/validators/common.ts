import type { Validator, ValidationError } from '../types/form';
import { compose, when } from './core';

// TODO: Добавить больше валидаторов
// Простых валидаторов недостаточно.
// Изучи частые паттерны валидации.
// Подумай о специфичных кейсах.

export function email(): Validator {
    // TODO: Улучшить email validator
    // Простого regex недостаточно.
    // Изучи RFC 5322.
    // Подумай о Unicode email.
    return {
        validate: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return [{
                    type: 'email',
                    message: 'Invalid email address'
                }];
            }
            return [];
        }
    };
}

export function pattern(regex: RegExp, message?: string): Validator {
    // TODO: Улучшить pattern validator
    // Простого test недостаточно.
    // Изучи Unicode patterns.
    // Подумай о безопасности regex.
    return {
        validate: (value: string) => {
            if (!regex.test(value)) {
                return [{
                    type: 'pattern',
                    message: message || 'Invalid format',
                    params: { pattern: regex.toString() }
                }];
            }
            return [];
        }
    };
}

export function range(min: number, max: number): Validator {
    // TODO: Улучшить range validator
    // Простого сравнения недостаточно.
    // Изучи Number.EPSILON.
    // Подумай о разных типах чисел.
    return {
        validate: (value: number) => {
            if (value < min || value > max) {
                return [{
                    type: 'range',
                    message: `Value must be between ${min} and ${max}`,
                    params: { min, max }
                }];
            }
            return [];
        }
    };
}

// TODO: Добавить custom validator factory
// Простой функции недостаточно.
// Изучи паттерны для custom validation.
// Подумай о типобезопасности.
export function custom(
    fn: (value: any) => ValidationError[],
    options: { message?: string } = {}
): Validator {
    // TODO: Улучшить custom validation
    // Простого вызова функции недостаточно.
    // Изучи error handling.
    // Подумай о контексте валидации.
    return {
        validate: (value: any) => {
            const errors = fn(value);
            return errors.map(error => ({
                ...error,
                message: options.message || error.message
            }));
        }
    };
}

// TODO: Добавить cross-field validator
// Простой функции недостаточно.
// Изучи паттерны для field dependencies.
// Подумай о циклических зависимостях.
export function crossField(
    field: string,
    fn: (value: any, other: any) => ValidationError[]
): Validator {
    // TODO: Улучшить cross-field validation
    // Простого сравнения недостаточно.
    // Изучи паттерны для form state.
    // Подумай о производительности.
    return {
        validate: (value: any, form: any) => {
            return fn(value, form[field]);
        }
    };
}
