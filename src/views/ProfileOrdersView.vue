<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

const user = computed(() => authStore.user)
const userOrders = computed(() => cartStore.getOrdersByUserId(user.value?.id || 0))

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
    pending: 'Ожидает подтверждения',
    processing: 'Обрабатывается',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">Мои заказы</h1>

      <div v-if="userOrders.length > 0" class="orders-list">
        <div v-for="order in userOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-header-left">
              <span class="order-id">Заказ #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <span :class="['badge', getStatusClass(order.status)]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-shipping">
            <h4>Адрес доставки</h4>
            <p>
              {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}, 
              {{ order.shippingAddress.postalCode }}
            </p>
            <p>{{ order.shippingAddress.name }}, {{ order.shippingAddress.phone }}</p>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <img :src="item.productImage" :alt="item.productName" />
              <div class="order-item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-qty">{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</span>
              </div>
              <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-payment">
              <span>Оплата: {{ order.paymentMethod === 'card' ? 'Картой онлайн' : 'Наличными' }}</span>
            </div>
            <div class="order-total">
              <span>Итого:</span>
              <span class="total-amount">{{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-orders">
        <div class="empty-icon">📦</div>
        <h2>У вас пока нет заказов</h2>
        <p>Оформите первый заказ в нашем каталоге</p>
        <router-link to="/catalog" class="btn btn-primary">
          Перейти в каталог
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 2rem 0;
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

.order-header-left {
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

.order-shipping {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.order-shipping h4 {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.order-shipping p {
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.order-items {
  padding: 1.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
}

.order-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 500;
}

.item-qty {
  font-size: 0.875rem;
  color: var(--text-light);
}

.item-total {
  font-weight: 600;
  color: var(--accent-color);
  white-space: nowrap;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-color);
}

.order-payment {
  font-size: 0.875rem;
  color: var(--text-light);
}

.order-total {
  display: flex;
  gap: 1rem;
  font-size: 1.125rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
}

.no-orders {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-orders h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.no-orders p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
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