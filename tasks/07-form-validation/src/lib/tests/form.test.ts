import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { useForm } from '../hooks/useForm';
import { required, minLength, email } from '../validators/common';
import { asyncValidator } from '../validators/core';

// TODO: Улучшить тесты
// Простых юнит тестов недостаточно.
// Изучи testing patterns.
// Подумай о coverage.

describe('Form Validation', () => {
    // TODO: Улучшить setup
    // Простого объекта недостаточно.
    // Изучи test fixtures.
    // Подумай о shared setup.
    const mockConfig = {
        fields: {
            username: {
                value: '',
                validators: [required(), minLength(3)]
            },
            email: {
                value: '',
                validators: [required(), email()]
            }
        }
    };

    describe('Form Initialization', () => {
        it('should initialize with default values', () => {
            const form = useForm(mockConfig);
            const state = get(form.state);
            
            expect(state.valid).toBe(true);
            expect(state.dirty).toBe(false);
            expect(state.touched).toBe(false);
            expect(state.submitted).toBe(false);
            expect(state.errors).toEqual({});
        });

        it('should initialize fields correctly', () => {
            const form = useForm(mockConfig);
            const username = form.fields.get('username');
            const email = form.fields.get('email');
            
            expect(get(username).value).toBe('');
            expect(get(email).value).toBe('');
        });
    });

    describe('Field Validation', () => {
        it('should validate required fields', async () => {
            const form = useForm(mockConfig);
            const username = form.fields.get('username');
            
            username.touch();
            await form.validate();
            
            expect(get(username).valid).toBe(false);
            expect(get(username).errors[0].type).toBe('required');
        });

        it('should validate minLength', async () => {
            const form = useForm(mockConfig);
            const username = form.fields.get('username');
            
            username.set('ab');
            username.touch();
            await form.validate();
            
            expect(get(username).valid).toBe(false);
            expect(get(username).errors[0].type).toBe('minLength');
        });

        it('should validate email format', async () => {
            const form = useForm(mockConfig);
            const email = form.fields.get('email');
            
            email.set('invalid-email');
            email.touch();
            await form.validate();
            
            expect(get(email).valid).toBe(false);
            expect(get(email).errors[0].type).toBe('email');
        });
    });

    describe('Async Validation', () => {
        // TODO: Улучшить async tests
        // Простого timeout недостаточно.
        // Изучи async test patterns.
        // Подумай о race conditions.
        it('should handle async validation', async () => {
            const asyncConfig = {
                fields: {
                    username: {
                        value: '',
                        validators: [required()],
                        asyncValidators: [
                            asyncValidator(async (value) => {
                                await new Promise(resolve => setTimeout(resolve, 100));
                                return value === 'taken'
                                    ? [{ type: 'unique', message: 'Username taken' }]
                                    : [];
                            })
                        ]
                    }
                }
            };

            const form = useForm(asyncConfig);
            const username = form.fields.get('username');
            
            username.set('taken');
            await form.validate();
            
            expect(get(username).valid).toBe(false);
            expect(get(username).errors[0].type).toBe('unique');
        });
    });

    describe('Form Submission', () => {
        it('should handle successful submission', async () => {
            const onSubmit = vi.fn();
            const form = useForm({
                ...mockConfig,
                onSubmit
            });
            
            form.fields.get('username').set('valid');
            form.fields.get('email').set('valid@email.com');
            
            await form.handleSubmit();
            
            expect(onSubmit).toHaveBeenCalledWith({
                username: 'valid',
                email: 'valid@email.com'
            });
        });

        it('should not submit invalid form', async () => {
            const onSubmit = vi.fn();
            const form = useForm({
                ...mockConfig,
                onSubmit
            });
            
            await form.handleSubmit();
            
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    describe('Form Reset', () => {
        it('should reset form state', () => {
            const form = useForm(mockConfig);
            const username = form.fields.get('username');
            
            username.set('test');
            username.touch();
            form.reset();
            
            const state = get(form.state);
            expect(state.valid).toBe(true);
            expect(state.dirty).toBe(false);
            expect(state.touched).toBe(false);
            expect(get(username).value).toBe('');
        });
    });

    // TODO: Добавить больше тестов
    // Простых кейсов недостаточно.
    // Изучи edge cases.
    // Подумай о нагрузочных тестах.
});
