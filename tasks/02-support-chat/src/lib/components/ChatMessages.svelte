<script lang="ts">
    import { activeChat, sendMessage } from '../stores/chatStore';
    
    let messageText = '';
    let messagesList: HTMLDivElement;
    
    // При получении нового сообщения прокручиваем список вниз
    $: if ($activeChat?.messages) {
        setTimeout(() => {
            messagesList?.scrollTo(0, messagesList.scrollHeight);
        }, 0);
    }
    
    function handleSubmit() {
        if (!messageText.trim() || !$activeChat) return;
        
        sendMessage($activeChat.id, messageText);
        messageText = '';
    }
</script>

<div class="chat-messages">
    {#if $activeChat}
        <div class="messages-list" bind:this={messagesList}>
            {#each $activeChat.messages as message (message.id)}
                <div class="message" class:outgoing={message.sender === 'operator'}>
                    <div class="message-content">
                        {message.text}
                        <span class="message-time">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            {/each}
            
            {#if $activeChat.isTyping}
                <div class="typing-indicator">
                    Клиент печатает...
                </div>
            {/if}
        </div>

        <form class="message-input" on:submit|preventDefault={handleSubmit}>
            <input
                type="text"
                bind:value={messageText}
                placeholder="Введите сообщение..."
            />
            <button type="submit">Отправить</button>
        </form>
    {:else}
        <div class="no-chat">
            Выберите чат для начала общения
        </div>
    {/if}
</div>

<style>
    .chat-messages {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .messages-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
    }
    
    .message {
        margin-bottom: 10px;
        display: flex;
    }
    
    .message.outgoing {
        justify-content: flex-end;
    }
    
    .message-content {
        background: #f1f1f1;
        padding: 10px;
        border-radius: 10px;
        max-width: 70%;
        position: relative;
    }
    
    .outgoing .message-content {
        background: #e3f2fd;
    }
    
    .message-time {
        font-size: 0.8em;
        color: #666;
        margin-left: 10px;
    }
    
    .typing-indicator {
        color: #666;
        font-style: italic;
        margin: 10px 0;
    }
    
    .message-input {
        display: flex;
        padding: 20px;
        border-top: 1px solid #eee;
    }
    
    .message-input input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 10px;
    }
    
    .message-input button {
        padding: 10px 20px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .message-input button:hover {
        background: #1976d2;
    }
    
    .no-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #666;
    }
</style>
