import { WebSocketServer } from 'ws';
import type { Message, Chat } from '../src/lib/stores/chatStore';

const wss = new WebSocketServer({ port: 3000 });

// Генерируем тестовые данные
const mockChats: Record<string, Chat> = {};
for (let i = 1; i <= 20; i++) {
    const chatId = `chat_${i}`;
    mockChats[chatId] = {
        id: chatId,
        clientName: `Client ${i}`,
        clientEmail: `client${i}@example.com`,
        status: 'active',
        messages: generateMockMessages(chatId, 150),
        unreadCount: Math.floor(Math.random() * 5),
        isTyping: false
    };
}

function generateMockMessages(chatId: string, count: number): Message[] {
    const messages: Message[] = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
        const id = `msg_${chatId}_${i}`;
        messages.push({
            id,
            chatId,
            text: `Mock message ${i + 1}. ${Lorem.generateSentences(1)}`,
            sender: i % 2 === 0 ? 'client' : 'operator',
            timestamp: now - (count - i) * 60000,
            status: 'delivered'
        });
    }
    
    return messages;
}

// Имитация задержки сети
const NETWORK_DELAY = 200;

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Отправляем начальные данные
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'initial_data',
            chats: mockChats
        }));
    }, NETWORK_DELAY);
    
    // Обработка сообщений от клиента
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
            case 'get_chat_history':
                // Имитация постраничной загрузки истории
                sendChatHistory(ws, message.chatId, message.page);
                break;
                
            case 'new_message':
                // Имитация отправки сообщения
                handleNewMessage(ws, message);
                break;
                
            case 'typing_status':
                // Имитация статуса печати
                broadcastTypingStatus(ws, message);
                break;
        }
    });
    
    // Имитация периодических событий
    startRandomEvents(ws);
});

function sendChatHistory(ws: WebSocket, chatId: string, page: number) {
    const pageSize = 50;
    const chat = mockChats[chatId];
    const start = page * pageSize;
    const end = start + pageSize;
    const messages = chat.messages.slice(start, end);
    
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'chat_history',
            chatId,
            messages,
            hasMore: end < chat.messages.length
        }));
    }, NETWORK_DELAY);
}

function handleNewMessage(ws: WebSocket, data: any) {
    const { chatId, message } = data;
    
    // Имитация задержки отправки
    setTimeout(() => {
        const newMessage = {
            ...message,
            id: `msg_${Date.now()}`,
            status: 'delivered',
            timestamp: Date.now()
        };
        
        mockChats[chatId].messages.push(newMessage);
        
        // Отправляем подтверждение отправителю
        ws.send(JSON.stringify({
            type: 'message_status',
            messageId: message.id,
            status: 'delivered'
        }));
        
        // Имитируем ответ клиента через случайное время
        scheduleClientResponse(ws, chatId);
    }, NETWORK_DELAY);
}

function scheduleClientResponse(ws: WebSocket, chatId: string) {
    const delay = 5000 + Math.random() * 5000;
    
    // Сначала отправляем статус печати
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'typing_status',
            chatId,
            isTyping: true
        }));
    }, delay - 2000);
    
    // Затем отправляем сообщение
    setTimeout(() => {
        const message = {
            id: `msg_${Date.now()}`,
            chatId,
            text: Lorem.generateSentences(1),
            sender: 'client',
            timestamp: Date.now(),
            status: 'sent'
        };
        
        mockChats[chatId].messages.push(message);
        
        ws.send(JSON.stringify({
            type: 'new_message',
            chatId,
            message
        }));
        
        // Убираем статус печати
        ws.send(JSON.stringify({
            type: 'typing_status',
            chatId,
            isTyping: false
        }));
    }, delay);
}

function startRandomEvents(ws: WebSocket) {
    // Периодически генерируем новые сообщения в случайных чатах
    setInterval(() => {
        const chatIds = Object.keys(mockChats);
        const randomChatId = chatIds[Math.floor(Math.random() * chatIds.length)];
        
        scheduleClientResponse(ws, randomChatId);
    }, 10000);
}

// Утилита для генерации текста
const Lorem = {
    words: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua'],
            
    generateSentences(count: number): string {
        const sentences = [];
        for (let i = 0; i < count; i++) {
            const wordCount = 5 + Math.floor(Math.random() * 10);
            const words = [];
            for (let j = 0; j < wordCount; j++) {
                words.push(this.words[Math.floor(Math.random() * this.words.length)]);
            }
            sentences.push(words.join(' ') + '.');
        }
        return sentences.join(' ');
    }
};

console.log('Mock WebSocket server running on ws://localhost:3000');
