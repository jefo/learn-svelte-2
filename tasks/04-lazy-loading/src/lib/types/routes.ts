// TODO: Спроектировать типы для системы загрузки
// Простых интерфейсов может быть недостаточно.
// Подумай о type guards и utility types.
// Изучи возможности TypeScript для сложных кейсов.

export interface LoadConfig {
    priority: 'high' | 'medium' | 'low';
    prefetch: boolean;
    timeout: number;
    retries: number;
}

export interface LoadMetrics {
    loadTime: number;
    bundleSize: number;
    interactiveTime: number;
    errorRate: number;
}

export interface RouteConfig {
    path: string;
    load: () => Promise<any>;
    preload?: boolean;
    prefetch?: boolean;
}

// TODO: Добавить типы для системы приоритетов
// Простого enum недостаточно.
// Подумай о взаимосвязях между приоритетами.
// Не забудь про динамическое изменение приоритетов.

// TODO: Расширить типы для метрик
// Текущих метрик может быть недостаточно.
// Изучи Web Vitals и подумай, что ещё важно отслеживать.
// Подумай о типизации сложных метрик.

// TODO: Добавить типы для кэширования
// Простого interface для кэша недостаточно.
// Подумай о версионировании и инвалидации.
// Изучи паттерны типизации кэш-систем.
