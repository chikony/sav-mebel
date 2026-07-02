<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import searchIcon from '@/assets/search-icon.png'
import cartIcon from '@/assets/cart-icon.png'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileMenuOpen = ref(false)
const searchQuery = ref('')

function search() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalog', query: { search: searchQuery.value } })
    searchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-inner">
        <router-link to="/" class="logo" @click="mobileMenuOpen = false">
          <span class="logo-icon">🏠</span>
          <span class="logo-text">САВ Мебель</span>
        </router-link>

        <nav :class="['nav', { 'nav-open': mobileMenuOpen }]">
          <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">
            Главная
          </router-link>
          <router-link to="/catalog" class="nav-link" @click="mobileMenuOpen = false">
            Каталог
          </router-link>
          <router-link to="/about" class="nav-link" @click="mobileMenuOpen = false">
            О нас
          </router-link>
          <router-link v-if="authStore.isAuthenticated" to="/profile" class="nav-link" @click="mobileMenuOpen = false">
            Профиль
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link admin-link" @click="mobileMenuOpen = false">
            Админ
          </router-link>
        </nav>

        <div class="header-actions">
          <form @submit.prevent="search" class="search-form">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск мебели..." 
              class="search-input"
            />
            <button type="submit" class="search-btn">
              <img :src="searchIcon" alt="Поиск" class="icon-img" />
            </button>
          </form>

          <router-link to="/cart" class="cart-btn" @click="mobileMenuOpen = false">
            <img :src="cartIcon" alt="Корзина" class="icon-img cart-icon-img" />
            <span v-if="cartStore.totalCount > 0" class="cart-badge">
              {{ cartStore.totalCount }}
            </span>
          </router-link>

          <div v-if="authStore.isAuthenticated" class="user-menu">
            <router-link to="/profile" class="user-name">
              {{ authStore.userName }}
            </router-link>
            <button @click="logout" class="logout-btn">Выйти</button>
          </div>
          <div v-else class="auth-buttons">
            <router-link to="/login" class="btn btn-secondary btn-sm" @click="mobileMenuOpen = false">
              Войти
            </router-link>
          </div>

          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
            <span v-if="mobileMenuOpen">✕</span>
            <span v-else>☰</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--white);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.75rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
}

.nav-link {
  font-weight: 500;
  color: var(--text-color);
  padding: 0.5rem 0.75rem;
  border-radius: 50px;
  transition: var(--transition);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--white);
  background: var(--secondary-color);
}

.admin-link {
  color: var(--accent-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.search-form {
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.search-input {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  width: 140px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-btn {
  background: none;
  padding: 0.5rem;
  line-height: 0;
}

.cart-btn {
  position: relative;
  padding: 0.5rem;
  text-decoration: none;
  line-height: 0;
}

.icon-img {
  width: 20px;
  height: 20px;
  display: block;
}

.cart-icon-img {
  width: 24px;
  height: 24px;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--accent-color);
  color: var(--white);
  font-size: 0.625rem;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-weight: 500;
  color: var(--text-color);
}

.logout-btn {
  background: none;
  color: var(--text-light);
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.logout-btn:hover {
  color: var(--accent-color);
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    flex-direction: column;
    padding: 1rem;
    gap: 0;
    box-shadow: var(--shadow);
  }

  .nav-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }

  .search-input {
    width: 120px;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-inner {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .search-form {
    display: none;
  }

  .auth-buttons {
    display: none;
  }
}
</style>