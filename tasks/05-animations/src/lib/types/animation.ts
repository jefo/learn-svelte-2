// TODO: Расширить типы для анимаций
// Простых интерфейсов недостаточно.
// Изучи паттерны типизации для animation systems.
// Подумай о type safety и inference.

export interface SpringConfig {
    stiffness: number;
    damping: number;
    precision: number;
    mass?: number;
}

export interface AnimationConfig {
    duration: number;
    easing: (t: number) => number;
    delay?: number;
    css?: boolean;
}

export interface AnimationMetrics {
    fps: number;
    duration: number;
    frames: number;
    dropped: number;
}

// TODO: Добавить типы для gesture
// Простых координат недостаточно.
// Изучи типы для pointer events.
// Подумай о multitouch support.
export interface GestureState {
    // TODO: Расширить состояние жестов
    // x и y координат недостаточно.
    // Изучи pointer events API.
    // Подумай о velocity и pressure.
}

// TODO: Добавить типы для композиции
// Простых списков анимаций мало.
// Изучи графы зависимостей.
// Подумай о параллельном выполнении.
export interface CompositionConfig {
    // TODO: Расширить конфигурацию
    // Простых массивов недостаточно.
    // Изучи паттерны оркестрации.
    // Подумай о сложных сценариях.
}

// TODO: Добавить типы для метрик
// FPS и duration не дают полной картины.
// Изучи Web Vitals.
// Подумай о user-centric метриках.
export interface PerformanceMetrics {
    // TODO: Расширить метрики
    // Количественных метрик недостаточно.
    // Изучи качественные метрики.
    // Подумай о распределении значений.
}
