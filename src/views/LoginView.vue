<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mockUsers } from '@/data/mockData'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

async function login() {
  error.value = ''
  
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const user = mockUsers.find(u => u.email === email.value)
  
  if (user) {
    // For demo purposes, any password works
    authStore.login(user, 'demo-token-' + Date.now())
    
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } else {
    error.value = 'Пользователь не найден'
  }

  loading.value = false
}
</script>

<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <h1 class="page-title">Вход</h1>
        
        <form @submit.prevent="login" class="login-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Введите ваш email"
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Введите пароль"
              autocomplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-lg btn-block" 
            :disabled="loading"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
        </div>

        <div class="demo-credentials">
          <p><strong>Демо-доступ:</strong></p>
          <p>Admin: admin@sav-mebel.ru</p>
          <p>User: user@example.com</p>
          <p>Пароль: любой</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  padding: 4rem 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.login-card {
  max-width: 420px;
  margin: 0 auto;
  background: var(--white);
  padding: 3rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.login-form {
  margin-bottom: 2rem;
}

.error-message {
  background: rgba(231, 76, 60, 0.1);
  color: var(--error-color);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.btn-block {
  width: 100%;
}

.login-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-light);
}

.login-footer a {
  color: var(--secondary-color);
  font-weight: 500;
}

.demo-credentials {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-color);
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--text-light);
}

.demo-credentials p {
  margin-bottom: 0.25rem;
}

.demo-credentials strong {
  color: var(--text-color);
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
}
</style>