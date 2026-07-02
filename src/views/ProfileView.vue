<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const user = computed(() => authStore.user)
const userOrders = computed(() => cartStore.getOrdersByUserId(user.value?.id || 0))
const isEditing = ref(false)
const editForm = ref({
  name: '',
  email: '',
  phone: ''
})

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (authStore.user) {
        authStore.user.avatar = dataUrl
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
    }
    reader.readAsDataURL(file)
  }
}

function startEditing() {
  editForm.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || ''
  }
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

function saveProfile() {
  // In a real app, this would update the user in the store/API
  if (user.value) {
    user.value.name = editForm.value.name
    user.value.email = editForm.value.email
    user.value.phone = editForm.value.phone
  }
  isEditing.value = false
  alert('Профиль успешно обновлен!')
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
    pending: 'Ожидает подтверждения',
    processing: 'Обрабатывается',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }
  return statusMap[status] || status
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="page-title">Личный кабинет</h1>

      <div class="profile-layout">
        <aside class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar" :style="user?.avatar ? { backgroundImage: `url(${user.avatar})` } : {}">
                <span v-if="!user?.avatar">{{ user?.name.charAt(0).toUpperCase() }}</span>
              </div>
              <label class="avatar-upload-btn" title="Загрузить аватарку">
                <input type="file" accept="image/*" @change="handleAvatarUpload" hidden />
                <span>📷</span>
              </label>
            </div>
            <h2 class="profile-name">{{ user?.name }}</h2>
            <p class="profile-email">{{ user?.email }}</p>
            <span v-if="user?.role === 'admin'" class="badge badge-error">Администратор</span>
          </div>

          <nav class="profile-nav">
            <router-link to="/profile" class="profile-nav-link" active-class="active">
              <span class="nav-icon">👤</span>
              Профиль
            </router-link>
            <router-link to="/profile/orders" class="profile-nav-link" active-class="active">
              <span class="nav-icon">📦</span>
              Мои заказы
            </router-link>
          </nav>
        </aside>

        <main class="profile-main">
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Информация о профиле</h2>
              <button v-if="!isEditing" class="btn btn-secondary btn-sm" @click="startEditing">
                Редактировать
              </button>
            </div>
            
            <div v-if="!isEditing" class="info-grid">
              <div class="info-item">
                <span class="info-label">Имя</span>
                <span class="info-value">{{ user?.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Телефон</span>
                <span class="info-value">{{ user?.phone || 'Не указан' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Дата регистрации</span>
                <span class="info-value">{{ formatDate(user?.createdAt || '') }}</span>
              </div>
            </div>

            <form v-else @submit.prevent="saveProfile" class="edit-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="edit-name">Имя</label>
                  <input id="edit-name" v-model="editForm.name" type="text" required />
                </div>
                <div class="form-group">
                  <label for="edit-email">Email</label>
                  <input id="edit-email" v-model="editForm.email" type="email" required />
                </div>
                <div class="form-group">
                  <label for="edit-phone">Телефон</label>
                  <input id="edit-phone" v-model="editForm.phone" type="tel" placeholder="+7 (___) ___-__-__" />
                </div>
                <div class="form-group">
                  <label>Дата регистрации</label>
                  <input type="text" :value="formatDate(user?.createdAt || '')" disabled />
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Сохранить</button>
                <button type="button" class="btn btn-secondary" @click="cancelEditing">Отмена</button>
              </div>
            </form>
          </div>

          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Последние заказы</h2>
              <router-link to="/profile/orders" class="link-all">Все заказы →</router-link>
            </div>

            <div v-if="userOrders.length > 0" class="orders-preview">
              <div v-for="order in userOrders.slice(0, 3)" :key="order.id" class="order-card">
                <div class="order-header">
                  <span class="order-id">Заказ #{{ order.id }}</span>
                  <span :class="['badge', getStatusClass(order.status)]">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                <div class="order-info">
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                  <span class="order-items-count">{{ order.items.length }} тов.</span>
                  <span class="order-total">{{ order.totalAmount.toLocaleString('ru-RU') }} ₽</span>
                </div>
                <div class="order-items-preview">
                  <img 
                    v-for="item in order.items.slice(0, 3)" 
                    :key="item.productId"
                    :src="item.productImage" 
                    :alt="item.productName"
                  />
                  <span v-if="order.items.length > 3" class="more-items">
                    +{{ order.items.length - 3 }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="no-orders">
              <p>У вас пока нет заказов</p>
              <router-link to="/catalog" class="btn btn-primary">
                Перейти в каталог
              </router-link>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="logout" class="btn btn-secondary">
              Выйти из аккаунта
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 2rem 0;
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: var(--secondary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: var(--secondary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);
}

.avatar-upload-btn:hover {
  background: var(--primary-color);
  transform: scale(1.1);
}

.profile-name {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
}

.profile-email {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.profile-nav {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.profile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.profile-nav-link:last-child {
  border-bottom: none;
}

.profile-nav-link:hover {
  background: var(--bg-color);
  color: var(--secondary-color);
}

.profile-nav-link.active {
  background: var(--secondary-color);
  color: var(--white);
}

.nav-icon {
  font-size: 1.25rem;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
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

.link-all {
  font-size: 0.875rem;
  color: var(--secondary-color);
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 500;
  color: var(--text-color);
}

.orders-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 1rem 1.5rem;
  transition: var(--transition);
}

.order-card:hover {
  box-shadow: var(--shadow);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.order-id {
  font-weight: 600;
  color: var(--primary-color);
}

.order-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.order-total {
  font-weight: 600;
  color: var(--accent-color);
  margin-left: auto;
}

.order-items-preview {
  display: flex;
  align-items: center;
}

.order-items-preview img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 2px solid var(--white);
  margin-left: -10px;
}

.order-items-preview img:first-child {
  margin-left: 0;
}

.more-items {
  width: 40px;
  height: 40px;
  background: var(--bg-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
  margin-left: -10px;
  border: 2px solid var(--white);
}

.no-orders {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.no-orders p {
  margin-bottom: 1.5rem;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
}

/* Edit Form */
.edit-form {
  margin-top: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .order-info {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>