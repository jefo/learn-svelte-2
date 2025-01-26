import { writable } from 'svelte/store';

interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: number;
}

export const performanceStore = writable<PerformanceMetric[]>([]);

// Измеряем время выполнения операций
export function measureOperation(name: string, operation: () => void): void {
    const start = performance.now();
    operation();
    const duration = performance.now() - start;
    
    performanceStore.update(metrics => [
        ...metrics,
        { name, duration, timestamp: Date.now() }
    ]);
}

// Проверяем производительность рендеринга
export function checkRenderPerformance(): void {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.duration > 16) { // Порог в 16мс (60 FPS)
                console.warn(`Slow render detected: ${entry.name} took ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
}

// Тесты производительности
export const performanceTests = {
    // Тест переключения чатов
    async testChatSwitching(switchChat: (id: string) => void) {
        const chatIds = ['chat_1', 'chat_2', 'chat_3'];
        const results = [];
        
        for (const chatId of chatIds) {
            const start = performance.now();
            switchChat(chatId);
            await new Promise(resolve => setTimeout(resolve, 100)); // Ждем рендеринга
            const duration = performance.now() - start;
            results.push({ chatId, duration });
        }
        
        return results;
    },
    
    // Тест прокрутки истории сообщений
    async testMessageScroll(scrollContainer: HTMLElement) {
        const results = [];
        const scrollPositions = [0, 0.5, 1]; // Начало, середина, конец
        
        for (const position of scrollPositions) {
            const start = performance.now();
            scrollContainer.scrollTop = scrollContainer.scrollHeight * position;
            await new Promise(resolve => setTimeout(resolve, 100));
            const duration = performance.now() - start;
            results.push({ position, duration });
        }
        
        return results;
    },
    
    // Тест добавления новых сообщений
    async testMessageAddition(addMessage: () => void) {
        const results = [];
        const messageCount = 10;
        
        for (let i = 0; i < messageCount; i++) {
            const start = performance.now();
            addMessage();
            await new Promise(resolve => setTimeout(resolve, 100));
            const duration = performance.now() - start;
            results.push({ messageIndex: i, duration });
        }
        
        return results;
    }
};

// Критерии производительности
export const performanceCriteria = {
    chatSwitch: 100, // ms
    messageScroll: 16, // ms (60 FPS)
    messageAdd: 50, // ms
    typingIndicator: 16 // ms
};

// Анализ производительности
export function analyzePerformance(metrics: PerformanceMetric[]): {
    passed: boolean;
    issues: string[];
} {
    const issues: string[] = [];
    let passed = true;
    
    // Группируем метрики по операциям
    const groupedMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.name]) acc[metric.name] = [];
        acc[metric.name].push(metric);
        return acc;
    }, {} as Record<string, PerformanceMetric[]>);
    
    // Проверяем каждую группу метрик
    Object.entries(groupedMetrics).forEach(([name, metrics]) => {
        const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
        
        switch (name) {
            case 'chatSwitch':
                if (avgDuration > performanceCriteria.chatSwitch) {
                    issues.push(`Slow chat switching: ${avgDuration.toFixed(2)}ms (should be < ${performanceCriteria.chatSwitch}ms)`);
                    passed = false;
                }
                break;
                
            case 'messageScroll':
                if (avgDuration > performanceCriteria.messageScroll) {
                    issues.push(`Choppy scrolling: ${avgDuration.toFixed(2)}ms (should be < ${performanceCriteria.messageScroll}ms)`);
                    passed = false;
                }
                break;
                
            case 'messageAdd':
                if (avgDuration > performanceCriteria.messageAdd) {
                    issues.push(`Slow message addition: ${avgDuration.toFixed(2)}ms (should be < ${performanceCriteria.messageAdd}ms)`);
                    passed = false;
                }
                break;
                
            case 'typingIndicator':
                if (avgDuration > performanceCriteria.typingIndicator) {
                    issues.push(`Laggy typing indicator: ${avgDuration.toFixed(2)}ms (should be < ${performanceCriteria.typingIndicator}ms)`);
                    passed = false;
                }
                break;
        }
    });
    
    return { passed, issues };
}
