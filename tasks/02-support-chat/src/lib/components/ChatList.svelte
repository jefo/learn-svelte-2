<script lang="ts">
    import { chats, activeChat, setActiveChat, type Chat } from '../stores/chatStore';
    
    // Подписываемся на все чаты сразу, что вызывает
    // проблемы с производительностью при обновлениях
    $: chatList = Object.values($chats).sort((a, b) => {
        return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
    });
</script>

<div class="chat-list">
    {#each chatList as chat (chat.id)}
        <div
            class="chat-item"
            class:active={$activeChat?.id === chat.id}
            on:click={() => setActiveChat(chat.id)}
        >
            <div class="chat-info">
                <span class="client-name">{chat.clientName}</span>
                <span class="last-message">
                    {chat.lastMessage?.text || 'Нет сообщений'}
                </span>
            </div>
            
            <div class="chat-status">
                {#if chat.unreadCount > 0}
                    <span class="unread-count">{chat.unreadCount}</span>
                {/if}
                {#if chat.isTyping}
                    <span class="typing-indicator">печатает...</span>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    .chat-list {
        width: 300px;
        border-right: 1px solid #eee;
        overflow-y: auto;
    }
    
    .chat-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }
    
    .chat-item:hover {
        background: #f5f5f5;
    }
    
    .chat-item.active {
        background: #e3f2fd;
    }
    
    .chat-info {
        display: flex;
        flex-direction: column;
    }
    
    .client-name {
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .last-message {
        color: #666;
        font-size: 0.9em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .chat-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }
    
    .unread-count {
        background: #2196f3;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 0.8em;
    }
    
    .typing-indicator {
        color: #666;
        font-size: 0.8em;
        font-style: italic;
    }
</style>
