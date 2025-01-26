// TODO: Расширить типы для форм
// Простых интерфейсов недостаточно.
// Изучи паттерны типизации форм.
// Подумай о сложных кейсах.

export interface FieldConfig<T> {
    value: T;
    validators: Validator[];
    asyncValidators?: AsyncValidator[];
    dependencies?: string[];
    condition?: (form: FormData) => boolean;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    pending: boolean;
    touched: boolean;
}

export interface FormState {
    valid: boolean;
    dirty: boolean;
    touched: boolean;
    submitted: boolean;
    errors: Record<string, ValidationError[]>;
}

// TODO: Добавить типы для валидаторов
// Простой функции недостаточно.
// Изучи паттерны для validator composition.
// Подумай о переиспользуемости.
export interface Validator {
    validate: (value: any) => ValidationError[];
    message?: string;
    params?: Record<string, any>;
}

// TODO: Добавить типы для async validators
// Promise.resolve недостаточно.
// Изучи паттерны для async validation.
// Подумай о timeout и retry.
export interface AsyncValidator {
    validate: (value: any) => Promise<ValidationError[]>;
    debounce?: number;
    cache?: boolean;
    timeout?: number;
}

// TODO: Расширить типы для ошибок
// Простого message недостаточно.
// Изучи i18n паттерны.
// Подумай о контексте ошибок.
export interface ValidationError {
    type: string;
    message: string;
    params?: Record<string, any>;
    field?: string;
}

// TODO: Добавить типы для field state
// Простых флагов недостаточно.
// Изучи паттерны для form state.
// Подумай о производительности.
export interface FieldState {
    value: any;
    initial: any;
    touched: boolean;
    dirty: boolean;
    valid: boolean;
    errors: ValidationError[];
    pending: boolean;
    dependencies: string[];
}
