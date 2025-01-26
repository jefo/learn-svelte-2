// Базовые типы для задачи
export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    createdAt: Date;
    deadline?: Date;
}

export interface TaskFilter {
    status?: Task['status'][];
    priority?: Task['priority'][];
    search?: string;
}

export interface TaskSort {
    field: keyof Task | 'none';
    direction: 'asc' | 'desc';
}
