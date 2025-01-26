import { describe, it, expect } from 'vitest';
import { required, minLength, email, pattern, range, crossField } from '../validators/common';
import { compose, when, asyncValidator } from '../validators/core';

// TODO: Улучшить тесты
// Простых проверок недостаточно.
// Изучи test patterns.
// Подумай о edge cases.

describe('Validators', () => {
    describe('Required Validator', () => {
        const validator = required();

        it('should validate empty values', () => {
            expect(validator.validate('')).toHaveLength(1);
            expect(validator.validate(null)).toHaveLength(1);
            expect(validator.validate(undefined)).toHaveLength(1);
        });

        it('should validate non-empty values', () => {
            expect(validator.validate('test')).toHaveLength(0);
            expect(validator.validate(0)).toHaveLength(0);
            expect(validator.validate(false)).toHaveLength(0);
        });
    });

    describe('MinLength Validator', () => {
        const validator = minLength(3);

        it('should validate string length', () => {
            expect(validator.validate('ab')).toHaveLength(1);
            expect(validator.validate('abc')).toHaveLength(0);
            expect(validator.validate('abcd')).toHaveLength(0);
        });

        // TODO: Добавить Unicode тесты
        // Простых ASCII тестов недостаточно.
        // Изучи Unicode.
        // Подумай о многобайтовых символах.
    });

    describe('Email Validator', () => {
        const validator = email();

        it('should validate email format', () => {
            expect(validator.validate('invalid')).toHaveLength(1);
            expect(validator.validate('test@example')).toHaveLength(1);
            expect(validator.validate('test@example.com')).toHaveLength(0);
        });

        // TODO: Добавить сложные email тесты
        // Простых адресов недостаточно.
        // Изучи RFC 5322.
        // Подумай о международных доменах.
    });

    describe('Pattern Validator', () => {
        const validator = pattern(/^[a-z]+$/, 'Only lowercase letters');

        it('should validate against pattern', () => {
            expect(validator.validate('123')).toHaveLength(1);
            expect(validator.validate('ABC')).toHaveLength(1);
            expect(validator.validate('abc')).toHaveLength(0);
        });

        // TODO: Добавить сложные regex тесты
        // Простых паттернов недостаточно.
        // Изучи regex security.
        // Подумай о производительности.
    });

    describe('Range Validator', () => {
        const validator = range(1, 10);

        it('should validate number range', () => {
            expect(validator.validate(0)).toHaveLength(1);
            expect(validator.validate(11)).toHaveLength(1);
            expect(validator.validate(5)).toHaveLength(0);
        });

        // TODO: Добавить float тесты
        // Простых целых чисел недостаточно.
        // Изучи IEEE 754.
        // Подумай о точности.
    });

    describe('Compose Validator', () => {
        const validator = compose(
            required(),
            minLength(3),
            pattern(/^[a-z]+$/)
        );

        it('should compose validators', () => {
            expect(validator.validate('')).toHaveLength(1);
            expect(validator.validate('a')).toHaveLength(1);
            expect(validator.validate('123')).toHaveLength(1);
            expect(validator.validate('abc')).toHaveLength(0);
        });

        // TODO: Добавить тесты композиции
        // Простой последовательности недостаточно.
        // Изучи functional composition.
        // Подумай о порядке валидации.
    });

    describe('When Validator', () => {
        const validator = when(
            value => value.length > 0,
            minLength(3)
        );

        it('should conditionally validate', () => {
            expect(validator.validate('')).toHaveLength(0);
            expect(validator.validate('a')).toHaveLength(1);
            expect(validator.validate('abc')).toHaveLength(0);
        });

        // TODO: Добавить сложные условия
        // Простых условий недостаточно.
        // Изучи паттерны для conditions.
        // Подумай о вложенных условиях.
    });

    describe('Async Validator', () => {
        // TODO: Улучшить async тесты
        // Простого timeout недостаточно.
        // Изучи async patterns.
        // Подумай о race conditions.
        const validator = asyncValidator(async (value) => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return value === 'invalid'
                ? [{ type: 'async', message: 'Invalid value' }]
                : [];
        });

        it('should validate asynchronously', async () => {
            expect(await validator.validate('valid')).toHaveLength(0);
            expect(await validator.validate('invalid')).toHaveLength(1);
        });
    });

    describe('Cross Field Validator', () => {
        const validator = crossField('password', (confirm, password) => {
            return confirm !== password
                ? [{ type: 'match', message: 'Values must match' }]
                : [];
        });

        it('should validate against other field', () => {
            expect(validator.validate('abc', { password: 'xyz' })).toHaveLength(1);
            expect(validator.validate('abc', { password: 'abc' })).toHaveLength(0);
        });

        // TODO: Добавить сложные зависимости
        // Простого сравнения недостаточно.
        // Изучи паттерны для dependencies.
        // Подумай о множественных зависимостях.
    });
});
