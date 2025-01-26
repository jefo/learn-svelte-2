import type { Subscriber, Unsubscriber } from 'svelte/store';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdAt: Date;
    deadline?: Date;
    tags: string[];
    assignee?: string;
    version: number;
}

export type ActionType = 
    | 'ADD_TASK'
    | 'UPDATE_TASK'
    | 'REMOVE_TASK'
    | 'REORDER_TASKS'
    | 'BULK_UPDATE';

export interface ActionMetadata {
    userId: string;
    timestamp: number;
    clientId: string;
    offline?: boolean;
}

export interface TaskAction {
    type: ActionType;
    payload: unknown;
    timestamp: number;
    metadata: ActionMetadata;
}

export interface TaskStore {
    subscribe: (run: Subscriber<Task[]>) => Unsubscriber;
    add: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void> | void;
    update: (id: string, changes: Partial<Task>) => Promise<void> | void;
    remove: (id: string) => Promise<void> | void;
    undo: () => void;
    redo: () => void;
    filter: (predicate: (task: Task) => boolean) => void;
}

// Utility types for the store implementation
export type TaskState = {
    tasks: Map<string, Task>;
    filteredIds: Set<string>;
    history: TaskAction[];
    historyIndex: number;
    version: number;
};

export type TaskStorageState = {
    tasks: Task[];
    version: number;
};
