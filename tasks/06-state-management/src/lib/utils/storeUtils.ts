import type { StoreManager } from '../stores/storeManager';
import type { StoreConfig, StoreMetrics } from '../types/store';

// TODO: Реализовать утилиты для stores
// Простых хелперов недостаточно.
// Изучи паттерны для store utilities.
// Подумай о переиспользуемости.

// TODO: Добавить батчинг обновлений
// Promise.resolve() не оптимально.
// Изучи микротаски и event loop.
// Подумай о приоритетах.
export function batch(callback: () => void) {
    // TODO: Реализовать умный батчинг
    // queueMicrotask недостаточно.
    // Изучи React batching strategies.
    // Подумай о вложенных обновлениях.
}

// TODO: Добавить мидлвары
// Простой функции недостаточно.
// Изучи паттерны для middleware.
// Подумай о композиции.
export function createMiddleware<T>(
    handler: (value: T, next: (value: T) => void) => void
) {
    // TODO: Улучшить middleware
    // Простого handler недостаточно.
    // Изучи Redux middleware.
    // Подумай о side effects.
}

// TODO: Добавить персистентность
// localStorage недостаточно.
// Изучи стратегии хранения.
// Подумай о форматах данных.
export function persist<T>(
    store: StoreManager<T>,
    key: string,
    storage = localStorage
) {
    // TODO: Улучшить хранение
    // JSON.stringify не универсально.
    // Изучи сериализацию данных.
    // Подумай о версионировании.
}

// TODO: Добавить метрики
// console.time недостаточно.
// Изучи Performance API.
// Подумай о профилировании.
export function measurePerformance<T>(store: StoreManager<T>) {
    return {
        // TODO: Улучшить метрики
        // Простых таймеров недостаточно.
        // Изучи Web Vitals.
        // Подумай о пользовательских метриках.
    };
}

// TODO: Добавить дебаг утилиты
// console.log недостаточно.
// Изучи DevTools API.
// Подумай о форматировании данных.
export function debug<T>(store: StoreManager<T>) {
    return {
        // TODO: Улучшить отладку
        // Простого логирования мало.
        // Изучи Chrome DevTools Protocol.
        // Подумай о интеграции с IDE.
    };
}
