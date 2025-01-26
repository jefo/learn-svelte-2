// TODO: Определить типы для кэша
// Подумай о гибкости и расширяемости типов.
// Возможно, стоит использовать дженерики для большей универсальности.

export interface CacheConfig {
    maxSize: number;
    ttl: number;
    strategy: 'lru' | 'lfu';
}

export interface CacheMetrics {
    hits: number;
    misses: number;
    evictions: number;
    memoryUsage: number;
}

export interface ComputationResult<T> {
    value: T;
    computeTime: number;
    cacheHit: boolean;
}

// TODO: Добавить типы для стратегий вытеснения
// Каждая стратегия имеет свои метаданные.
// Продумай структуру данных для эффективного хранения этой информации.

// TODO: Определить типы для метрик производительности
// Метрики должны быть информативными, но легковесными.
// Подумай, какие данные действительно важны для анализа.
