// Базовые типы для виртуального списка
export interface ListItem {
    id: string;
    height?: number;
    content: string;
    image?: string;
    timestamp: Date;
}

export interface VirtualConfig {
    itemHeight: number;     // Базовая высота элемента
    overscan: number;       // Количество предзагружаемых элементов
    threshold: number;      // Порог для подгрузки новых данных
}

export interface VirtualMetrics {
    fps: number;           // Текущий FPS
    memoryUsage: number;   // Использование памяти в MB
    renderTime: number;    // Время рендера в ms
    scrollDelay: number;   // Задержка при прокрутке в ms
}

export interface LoadMoreEvent {
    startIndex: number;    // Начальный индекс для загрузки
    stopIndex: number;     // Конечный индекс для загрузки
    currentLength: number; // Текущее количество элементов
}
