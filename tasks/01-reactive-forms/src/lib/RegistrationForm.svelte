<script lang="ts">
    // TODO: Реализовать валидацию с использованием реактивных выражений
    let formData = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    let errors = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    // TODO: Добавить реактивные выражения для валидации
    $: {
        // Пример простой валидации
        errors.username = formData.username.length < 3 
            ? 'Username должен быть не менее 3 символов' 
            : '';
    }

    function handleSubmit() {
        // TODO: Реализовать обработку отправки формы
        console.log('Form submitted:', formData);
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="registration-form">
    <div class="form-group">
        <label for="username">Username</label>
        <input
            type="text"
            id="username"
            bind:value={formData.username}
            class:error={errors.username}
        />
        {#if errors.username}
            <span class="error-message">{errors.username}</span>
        {/if}
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            bind:value={formData.email}
            class:error={errors.email}
        />
        {#if errors.email}
            <span class="error-message">{errors.email}</span>
        {/if}
    </div>

    <div class="form-group">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            bind:value={formData.password}
            class:error={errors.password}
        />
        {#if errors.password}
            <span class="error-message">{errors.password}</span>
        {/if}
    </div>

    <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
            type="password"
            id="confirmPassword"
            bind:value={formData.confirmPassword}
            class:error={errors.confirmPassword}
        />
        {#if errors.confirmPassword}
            <span class="error-message">{errors.confirmPassword}</span>
        {/if}
    </div>

    <button type="submit">Register</button>
</form>

<style>
    .registration-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    input.error {
        border-color: red;
    }

    .error-message {
        color: red;
        font-size: 0.8em;
        margin-top: 5px;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
