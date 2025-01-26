import { writable } from 'svelte/store';

export interface Message {
    id: string;
    chatId: string;
    text: string;
    sender: 'client' | 'operator';
    timestamp: number;
    status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Chat {
    id: string;
    clientName: string;
    clientEmail: string;
    status: 'active' | 'closed';
    messages: Message[];
    unreadCount: number;
    isTyping: boolean;
    lastMessage?: Message;
}

// Текущая реализация загружает все чаты разом
// и хранит все сообщения в памяти
export const chats = writable<Record<string, Chat>>({});

// Активный чат содержит все сообщения, что вызывает
// проблемы при переключении между чатами
export const activeChat = writable<Chat | null>(null);

// WebSocket подключение
let ws: WebSocket;

// Подключаемся к серверу и слушаем события
export function initializeWebSocket() {
    ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // При получении нового сообщения обновляем весь чат
        if (data.type === 'new_message') {
            chats.update(allChats => {
                const chat = allChats[data.chatId];
                return {
                    ...allChats,
                    [data.chatId]: {
                        ...chat,
                        messages: [...chat.messages, data.message],
                        lastMessage: data.message,
                        unreadCount: chat.unreadCount + 1
                    }
                };
            });
        }
        
        // Обновляем статус печати для всего чата
        if (data.type === 'typing_status') {
            chats.update(allChats => {
                const chat = allChats[data.chatId];
                return {
                    ...allChats,
                    [data.chatId]: {
                        ...chat,
                        isTyping: data.isTyping
                    }
                };
            });
        }
    };
}

// Отправка сообщения без оптимистичного обновления
export function sendMessage(chatId: string, text: string) {
    const message: Partial<Message> = {
        chatId,
        text,
        sender: 'operator',
        timestamp: Date.now(),
        status: 'sending'
    };
    
    ws.send(JSON.stringify({
        type: 'new_message',
        chatId,
        message
    }));
}

// Переключение между чатами требует загрузки всей истории
export function setActiveChat(chatId: string) {
    chats.update(allChats => {
        const chat = allChats[chatId];
        activeChat.set(chat);
        return allChats;
    });
}
