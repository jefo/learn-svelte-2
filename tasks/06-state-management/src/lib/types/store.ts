// TODO: Расширить типы для store system
// Простых интерфейсов недостаточно.
// Изучи паттерны типизации для state management.
// Подумай о type safety и inference.

export interface StoreConfig<T> {
    initialValue: T;
    persistence?: boolean;
    validation?: (value: T) => boolean;
    middleware?: StoreMiddleware<T>[];
}

export interface StoreMetrics {
    subscribers: number;
    updates: number;
    computeTime: number;
    memoryUsage: number;
}

export interface SyncConfig {
    strategy: 'optimistic' | 'pessimistic';
    retries: number;
    backoff: number;
    timeout: number;
}

// TODO: Добавить типы для middleware
// Простой функции недостаточно.
// Изучи паттерны для middleware systems.
// Подумай о композиции middleware.
export type StoreMiddleware<T> = (
    next: (value: T) => void
) => (value: T) => void;

// TODO: Добавить типы для подписок
// Простого callback недостаточно.
// Изучи паттерны для subscription systems.
// Подумай о фильтрации и трансформации.
export interface Subscription<T> {
    callback: (value: T) => void;
    filter?: (value: T) => boolean;
    transform?: (value: T) => any;
}

// TODO: Расширить типы для производительности
// Простых числовых метрик недостаточно.
// Изучи Web Performance API.
// Подумай о пользовательских метриках.
export interface PerformanceMetrics {
    updateTime: number;
    memoryDelta: number;
    subscriptionCount: number;
    batchSize: number;
}
