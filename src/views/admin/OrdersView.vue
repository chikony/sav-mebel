<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const orders = computed(() => cartStore.orders)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-info',
    delivered: 'badge-success',
    cancelled: 'badge-error'
  }
  return statusMap[status] || 'badge-info'
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Oжидает',
    processing: 'В работе',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }
  return statusMap[status] || status
}

function updateStatus(orderId: number, newStatus: string) {
  // Update order status in the store - this will reflect in profile
  const order = cartStore.orders.find(o => o.id === orderId)
  if (order) {
    order.status = newStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  }
}
</script>

<template>
  <div class="admin-orders-page">
    <div class="container">
      <h1 class="page-title">Управление заказами</h1>
      <p class="page-subtitle">{{ orders.length }} заказов всего</p>

      <div v-if="orders.length > 0" class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">Заказ #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div class="order-status">
              <select 
                :value="order.status"
                @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                :class="['status-select', getStatusClass(order.status)]"
              >
                <option value="pending">Ожидает</option>
                <option value="processing">В работе</option>
                <option value="shipped">Отправлен</option>
                <option value="delivered">Доставлен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>
          </div>

          <div class="order-content">
            <div class="order-items">
              <div v-for="item in order.items" :key="item.productId" class="order-item">
                <img :src="item.productImage" :alt="item.productName" />
                <div class="item-info">
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-meta">{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</span>
                </div>
                <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="order-details">
              <div class="detail-block">
                <h4>Адрес доставки</h4>
                <p>{{ order.shippingAddress.address }}</p>
                <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
                <p>{{ order.shippingAddress.name }}</p>
                <p>{{ order.shippingAddress.phone }}</p>
              </div>

              <div class="detail-block">
                <h4>Оплата</h4>
                <p>{{ order.paymentMethod === 'card' ? 'Картой онлайн' : 'Наличными при получении' }}</p>
              </div>

              <div class="order-total-block">
                <span>Итого:</span>
                <span class="total-amount">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-orders">
        <p>Заказов пока нет</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-orders-page {
  padding: 2rem 0;
}

.page-subtitle {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-id {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.order-date {
  font-size: 0.875rem;
  color: var(--text-light);
}

.status-select {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--white);
}

.status-select.badge-warning {
  background: var(--warning-color);
}

.status-select.badge-info {
  background: var(--secondary-color);
}

.status-select.badge-success {
  background: var(--success-color);
}

.status-select.badge-error {
  background: var(--error-color);
}

.order-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  padding: 1.5rem;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
}

.item-meta {
  font-size: 0.875rem;
  color: var(--text-light);
}

.item-total {
  font-weight: 600;
  color: var(--accent-color);
  white-space: nowrap;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--border-color);
}

.detail-block h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.detail-block p {
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.order-total-block {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 1.125rem;
  font-weight: 600;
}

.total-amount {
  font-size: 1.5rem;
  color: var(--accent-color);
}

.no-orders {
  text-align: center;
  padding: 4rem;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

@media (max-width: 1024px) {
  .order-content {
    grid-template-columns: 1fr;
  }

  .order-details {
    padding-left: 0;
    border-left: none;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-item {
    flex-wrap: wrap;
  }

  .item-total {
    width: 100%;
    text-align: right;
    margin-top: 0.5rem;
  }
}
</style>