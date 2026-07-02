<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const products = computed(() => productsStore.products)
const orders = computed(() => cartStore.orders)
const totalRevenue = computed(() => 
  orders.value.reduce((sum, order) => sum + order.totalAmount, 0)
)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
    pending: 'Ожидает',
    processing: 'В работе',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="admin-page">
    <div class="container">
      <div class="admin-header">
        <h1 class="page-title">Админ-панель</h1>
        <p class="admin-welcome">Добро пожаловать, {{ authStore.userName }}!</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-cards">
        <div class="stat-card">
          <!-- ВСТАВИТЬ СЮДА ИКОНКУ ТОВАРА (SVG или img) -->
          <div class="stat-icon icon-products"></div>
          <div class="stat-info">
            <span class="stat-value">{{ products.length }}</span>
            <span class="stat-label">Товаров</span>
          </div>
        </div>
        <div class="stat-card">
          <!-- ВСТАВИТЬ SУДА ИКОНКУ ЗАКАЗА (SVG или img) -->
          <div class="stat-icon icon-orders"></div>
          <div class="stat-info">
            <span class="stat-value">{{ orders.length }}</span>
            <span class="stat-label">Заказов</span>
          </div>
        </div>
        <div class="stat-card">
          <!-- ВСТАВИТЬ СЮДА ИКОНКУ ДЕНЕГ (SVG или img) -->
          <div class="stat-icon icon-revenue"></div>
          <div class="stat-info">
            <span class="stat-value">{{ formatPrice(totalRevenue) }}</span>
            <span class="stat-label">Выручка</span>
          </div>
        </div>
        <div class="stat-card">
          <!-- ВСТАВИТЬ СЮДА ИКОНКУ ПОЛЬЗОВАТЕЛЕЙ (SVG или img) -->
          <div class="stat-icon icon-users"></div>
          <div class="stat-info">
            <span class="stat-value">2</span>
            <span class="stat-label">Пользователей</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <section class="admin-section">
        <div class="section-header">
          <h2 class="section-title">Последние заказы</h2>
          <router-link to="/admin/orders" class="btn btn-secondary btn-sm">
            Все заказы →
          </router-link>
        </div>

        <div v-if="orders.length > 0" class="orders-table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders.slice(0, 5)" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>{{ formatPrice(order.totalAmount) }}</td>
                <td>
                  <span :class="['badge', getStatusClass(order.status)]">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td>
                  <router-link :to="`/admin/orders`" class="btn btn-sm btn-secondary">
                    Просмотр
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="no-data">Заказов пока нет</p>
      </section>

      <!-- Quick Actions -->
      <section class="admin-section">
        <h2 class="section-title">Быстрые действия</h2>
        <div class="quick-actions">
          <router-link to="/admin/products" class="action-card">
            <!-- ВСТАВИТЬ СЮДА ИКОНКУ ТОВАРА (SVG или img) -->
            <span class="action-icon icon-products"></span>
            <span class="action-label">Управление товарами</span>
          </router-link>
          <router-link to="/admin/orders" class="action-card">
            <!-- ВСТАВИТЬ СЮДА ИКОНКУ ЗАКАЗА (SVG или img) -->
            <span class="action-icon icon-orders"></span>
            <span class="action-label">Управление заказами</span>
          </router-link>
          <router-link to="/admin/users" class="action-card">
            <!-- ВСТАВИТЬ СЮДА ИКОНКУ ПОЛЬЗОВАТЕЛЕЙ (SVG или img) -->
            <span class="action-icon icon-users"></span>
            <span class="action-label">Управление пользователями</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem 0;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-welcome {
  color: var(--text-light);
  font-size: 1.125rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-light);
}

.admin-section {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.orders-table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.orders-table th {
  font-weight: 600;
  color: var(--text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
}

.orders-table tr:last-child td {
  border-bottom: none;
}

.no-data {
  text-align: center;
  color: var(--text-light);
  padding: 2rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--bg-color);
  border-radius: var(--radius);
  text-decoration: none;
  transition: var(--transition);
}

.action-card:hover {
  background: var(--secondary-color);
  transform: translateY(-4px);
}

.action-card:hover .action-label {
  color: var(--white);
}

.action-icon {
  font-size: 3rem;
}

.action-label {
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>