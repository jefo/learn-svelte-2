<script lang="ts">
    import { orderStore } from '../stores/orderStore';
    
    /**
     * ЗАДАЧА 1: Оптимизация подписок на store
     * 
     * Сейчас мы подписываемся на весь orderStore целиком. Это значит:
     * - Компонент перерендерится при любом изменении в store
     * - Даже если изменился только статус заказа, мы перерисовываем весь список
     * - Мы храним копию всего store в локальной переменной
     * 
     * Подумай:
     * - Как можно подписаться только на нужные данные?
     * - Где может помочь автоматическая подписка через $store?
     * - Как избежать ненужных обновлений компонента?
     */
    let order;
    orderStore.subscribe(value => {
        order = value;
    });
    
    /**
     * ЗАДАЧА 2: Оптимизация фильтрации и сортировки
     * 
     * Текущая реализация имеет несколько проблем:
     * - Фильтрация происходит при каждом рендере
     * - Результат не кешируется между обновлениями
     * - При изменении одного товара пересчитывается весь список
     * 
     * Подумай:
     * - Как можно использовать derived store для фильтрации?
     * - Когда действительно нужно пересчитывать filteredProducts?
     * - Как можно мемоизировать результаты фильтрации?
     */
    $: filteredProducts = order?.products || [];
    
    /**
     * ЗАДАЧА 3: Оптимизация обновления UI
     * 
     * Текущая реализация updateQuantity не оптимальна:
     * - Создается новый массив при каждом обновлении
     * - Пересчитывается total для всего заказа
     * - Обновляется весь UI список при изменении одного товара
     * 
     * Подумай:
     * - Как можно обновить только измененный элемент?
     * - Стоит ли выносить логику расчета total в store?
     * - Как использовать анимации для плавного обновления UI?
     */
    function updateQuantity(productId: number, newQuantity: number) {
        orderStore.update(order => {
            const products = order.products.map(product =>
                product.id === productId
                    ? { ...product, quantity: newQuantity }
                    : product
            );
            return {
                ...order,
                products,
                total: products.reduce((sum, p) => sum + p.price * p.quantity, 0)
            };
        });
    }
</script>

<div class="order-list">
    {#if filteredProducts.length > 0}
        {#each filteredProducts as product (product.id)}
            <div class="product-item">
                <span>{product.name}</span>
                <input
                    type="number"
                    min="1"
                    bind:value={product.quantity}
                    on:input={() => updateQuantity(product.id, product.quantity)}
                />
                <span>${product.price * product.quantity}</span>
            </div>
        {/each}
        <div class="total">
            Total: ${order.total}
        </div>
    {:else}
        <p>No products in order</p>
    {/if}
</div>

<style>
    .order-list {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    .product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    input {
        width: 60px;
        padding: 5px;
    }

    .total {
        margin-top: 20px;
        text-align: right;
        font-weight: bold;
    }
</style>
