<script lang="ts">
    import { slide } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    
    interface CartItem {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }

    // Тестовые данные
    let items: CartItem[] = [
        { id: 1, name: "Product 1", price: 10, quantity: 1 },
        { id: 2, name: "Product 2", price: 20, quantity: 1 }
    ];

    /**
     * ЗАДАЧА 1: Анимация изменения количества
     * 
     * Сейчас при изменении количества товара происходит резкое обновление UI:
     * - Число просто меняется без анимации
     * - Общая сумма резко перескакивает на новое значение
     * - При удалении товара (quantity = 0) он резко исчезает
     * 
     * Подумай:
     * - Как можно анимировать изменение числа?
     * - Какой тип анимации подойдет для плавного исчезновения?
     * - Как сделать изменение суммы более плавным?
     */
    function updateQuantity(id: number, delta: number) {
        items = items.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                : item
        ).filter(item => item.quantity > 0);
    }

    /**
     * ЗАДАЧА 2: Анимация общей суммы
     * 
     * При каждом изменении количества или состава корзины total резко меняется:
     * - Нет визуальной связи между изменением количества и суммой
     * - Пользователь может не заметить изменение при быстрых операциях
     * - Большие изменения суммы выглядят резко
     * 
     * Подумай:
     * - Как можно использовать spring анимации для чисел?
     * - Какие параметры пружины сделают анимацию наиболее естественной?
     * - Как связать анимацию с размером изменения?
     */
    $: total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    /**
     * ЗАДАЧА 3: Анимация списка товаров
     * 
     * Текущая реализация имеет несколько проблем:
     * - Новые товары появляются резко
     * - При удалении нет плавного перемещения оставшихся товаров
     * - Нет визуальной обратной связи при действиях пользователя
     * 
     * Подумай:
     * - Как использовать flip анимации для списка?
     * - Какие transition эффекты подойдут для добавления/удаления?
     * - Как сделать анимации отзывчивыми к действиям пользователя?
     */
    function addItem() {
        const newId = Math.max(...items.map(i => i.id)) + 1;
        items = [...items, {
            id: newId,
            name: `Product ${newId}`,
            price: Math.floor(Math.random() * 50) + 10,
            quantity: 1
        }];
    }
</script>

<div class="shopping-cart">
    <h2>Shopping Cart</h2>
    
    <div class="cart-items">
        {#each items as item (item.id)}
            <div class="cart-item">
                <span class="item-name">{item.name}</span>
                <div class="quantity-controls">
                    <button on:click={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button on:click={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <span class="item-total">${item.price * item.quantity}</span>
            </div>
        {/each}
    </div>

    <div class="cart-footer">
        <button class="add-item" on:click={addItem}>Add Random Item</button>
        <div class="total">Total: ${total}</div>
    </div>
</div>

<style>
    .shopping-cart {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cart-items {
        margin: 20px 0;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .quantity-controls button {
        width: 30px;
        height: 30px;
        border: none;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
    }

    .cart-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px solid #eee;
    }

    .total {
        font-size: 1.2em;
        font-weight: bold;
    }

    .add-item {
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .add-item:hover {
        background: #45a049;
    }
</style>
