<script lang="ts">
    import { Form, Field } from './lib/components';
    import { required, minLength, email, pattern, crossField } from './lib/validators/common';
    import { asyncValidator } from './lib/validators/core';
    
    // TODO: Улучшить валидацию
    // Простых правил недостаточно.
    // Изучи бизнес-правила.
    // Подумай о безопасности.
    
    // Имитация API
    async function checkEmailExists(email: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return email.includes('exists');
    }
    
    // TODO: Улучшить конфигурацию
    // Простого объекта недостаточно.
    // Изучи builder pattern.
    // Подумай о валидации конфига.
    const formConfig = {
        fields: {
            username: {
                value: '',
                validators: [
                    required(),
                    minLength(3),
                    pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore')
                ]
            },
            email: {
                value: '',
                validators: [
                    required(),
                    email()
                ],
                asyncValidators: [
                    asyncValidator(async (value) => {
                        const exists = await checkEmailExists(value);
                        return exists ? [{
                            type: 'unique',
                            message: 'Email already exists'
                        }] : [];
                    }, { debounce: 500 })
                ]
            },
            password: {
                value: '',
                validators: [
                    required(),
                    minLength(8),
                    pattern(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                        'Password must contain uppercase, lowercase and number'
                    )
                ]
            },
            confirmPassword: {
                value: '',
                validators: [
                    required(),
                    crossField('password', (confirm, password) => {
                        return confirm !== password
                            ? [{ type: 'match', message: 'Passwords must match' }]
                            : [];
                    })
                ],
                dependencies: ['password']
            }
        },
        onSubmit: async (values) => {
            console.log('Form submitted:', values);
            // TODO: Улучшить отправку
            // console.log недостаточно.
            // Изучи error handling.
            // Подумай о retry logic.
        }
    };
</script>

<main>
    <div class="registration">
        <h2>Registration</h2>
        
        <Form {formConfig} let:form>
            <Field
                name="username"
                label="Username"
                type="text"
                autocomplete="username"
            />
            
            <Field
                name="email"
                label="Email"
                type="email"
                autocomplete="email"
            />
            
            <Field
                name="password"
                label="Password"
                type="password"
                autocomplete="new-password"
            />
            
            <Field
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                autocomplete="new-password"
            />
            
            <!-- TODO: Улучшить кнопку -->
            <!-- Простой кнопки недостаточно. -->
            <!-- Изучи loading states. -->
            <!-- Подумай о feedback. -->
            <button
                type="submit"
                class="submit"
                disabled={!$form.state.valid || $form.state.pending}
            >
                {#if $form.state.pending}
                    Validating...
                {:else}
                    Register
                {/if}
            </button>
            
            <!-- TODO: Улучшить debug -->
            <!-- Простого pre недостаточно. -->
            <!-- Изучи dev tools. -->
            <!-- Подумай о форматировании. -->
            {#if import.meta.env.DEV}
                <pre class="debug">
                    {JSON.stringify($form.state, null, 2)}
                </pre>
            {/if}
        </Form>
    </div>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        background: #f5f5f5;
    }
    
    .registration {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h2 {
        margin: 0 0 2rem;
        text-align: center;
        color: #333;
    }
    
    .submit {
        width: 100%;
        padding: 0.75rem;
        margin-top: 1rem;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .submit:hover:not(:disabled) {
        background: #0052a3;
    }
    
    .submit:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
    
    .debug {
        margin-top: 2rem;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: pre-wrap;
    }
</style>
