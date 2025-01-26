import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { createTaskStore } from './solution';
import type { Task, TaskStore } from './types';

describe('TaskStore Implementation', () => {
    let store: TaskStore;
    
    beforeEach(() => {
        store = createTaskStore();
        localStorage.clear();
        vi.useFakeTimers();
    });

    describe('Functional Requirements', () => {
        it('should perform CRUD operations with undo/redo support', () => {
            const task: Omit<Task, 'id' | 'createdAt'> = {
                title: 'Test Task',
                description: 'Description',
                priority: 'high',
                status: 'todo',
                tags: ['test'],
                version: 1
            };

            // Add
            store.add(task);
            let tasks = get(store);
            expect(tasks).toHaveLength(1);
            const taskId = tasks[0].id;

            // Update
            store.update(taskId, { status: 'in-progress' });
            tasks = get(store);
            expect(tasks[0].status).toBe('in-progress');

            // Undo
            store.undo();
            tasks = get(store);
            expect(tasks[0].status).toBe('todo');

            // Redo
            store.redo();
            tasks = get(store);
            expect(tasks[0].status).toBe('in-progress');

            // Remove
            store.remove(taskId);
            tasks = get(store);
            expect(tasks).toHaveLength(0);
        });

        it('should handle filtering and search correctly', () => {
            // Add multiple tasks
            for (let i = 0; i < 100; i++) {
                store.add({
                    title: `Task ${i}`,
                    description: 'Description',
                    priority: i % 2 === 0 ? 'high' : 'low',
                    status: 'todo',
                    tags: [`tag${i % 3}`],
                    version: 1
                });
            }

            // Filter by priority
            store.filter(task => task.priority === 'high');
            let tasks = get(store);
            expect(tasks).toHaveLength(50);

            // Filter by tags
            store.filter(task => task.tags.includes('tag0'));
            tasks = get(store);
            expect(tasks).toHaveLength(34);
        });
    });

    describe('Performance Requirements', () => {
        it('should handle large datasets efficiently', async () => {
            const start = performance.now();
            
            // Add 10000 tasks
            for (let i = 0; i < 10000; i++) {
                store.add({
                    title: `Task ${i}`,
                    description: 'Description',
                    priority: i % 2 === 0 ? 'high' : 'low',
                    status: 'todo',
                    tags: [`tag${i % 10}`],
                    version: 1
                });
            }

            const end = performance.now();
            expect(end - start).toBeLessThan(1000); // Should complete in under 1s

            // Measure filter performance
            const filterStart = performance.now();
            store.filter(task => task.priority === 'high');
            const filterEnd = performance.now();
            expect(filterEnd - filterStart).toBeLessThan(16); // One frame @ 60fps
        });

        it('should optimize memory usage during undo/redo', () => {
            // Add and modify tasks
            for (let i = 0; i < 1000; i++) {
                store.add({
                    title: `Task ${i}`,
                    description: 'Description',
                    priority: 'low',
                    status: 'todo',
                    tags: [],
                    version: 1
                });
            }

            // Perform multiple updates
            const tasks = get(store);
            for (let i = 0; i < 100; i++) {
                store.update(tasks[i].id, { status: 'in-progress' });
            }

            // Memory usage should be reasonable
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
            expect(memoryUsage).toBeLessThan(50); // Less than 50MB
        });
    });

    describe('Edge Cases', () => {
        it('should handle concurrent modifications', async () => {
            const task: Omit<Task, 'id' | 'createdAt'> = {
                title: 'Test Task',
                description: 'Description',
                priority: 'high',
                status: 'todo',
                tags: ['test'],
                version: 1
            };

            store.add(task);
            const tasks = get(store);
            const taskId = tasks[0].id;

            // Simulate concurrent updates
            const update1 = store.update(taskId, { status: 'in-progress', version: 2 });
            const update2 = store.update(taskId, { priority: 'low', version: 2 });

            await Promise.all([update1, update2]);

            const finalTask = get(store)[0];
            expect(finalTask.version).toBe(2);
        });

        it('should recover from storage errors', () => {
            // Simulate storage error
            vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
                throw new Error('Storage full');
            });

            const task: Omit<Task, 'id' | 'createdAt'> = {
                title: 'Test Task',
                description: 'Description',
                priority: 'high',
                status: 'todo',
                tags: ['test'],
                version: 1
            };

            // Should not throw and maintain consistency
            expect(() => store.add(task)).not.toThrow();
            expect(get(store)).toHaveLength(1);
        });

        it('should maintain consistency during undo/redo operations', () => {
            // Add multiple tasks and perform operations
            for (let i = 0; i < 10; i++) {
                store.add({
                    title: `Task ${i}`,
                    description: 'Description',
                    priority: 'low',
                    status: 'todo',
                    tags: [],
                    version: 1
                });
            }

            // Perform mixed operations
            const tasks = get(store);
            store.update(tasks[0].id, { status: 'in-progress' });
            store.remove(tasks[1].id);
            store.update(tasks[2].id, { priority: 'high' });

            // Undo all operations
            store.undo();
            store.undo();
            store.undo();

            // Verify state
            const finalTasks = get(store);
            expect(finalTasks).toHaveLength(10);
            expect(finalTasks[0].status).toBe('todo');
            expect(finalTasks[2].priority).toBe('low');
        });
    });
});
