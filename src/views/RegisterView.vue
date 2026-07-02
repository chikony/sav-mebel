<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const error = ref('')
const loading = ref(false)

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function register() {
  error.value = ''
  
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Заполните все обязательные поля'
    return
  }

  if (!validateEmail(email.value)) {
    error.value = 'Введите корректный email'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now(),
    email: email.value,
    name: name.value,
    phone: phone.value || undefined,
    role: 'user',
    createdAt: new Date().toISOString()
  }

  authStore.login(newUser, 'demo-token-' + Date.now())
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <div class="container">
      <div class="register-card">
        <h1 class="page-title">Регистрация</h1>
        
        <form @submit.prevent="register" class="register-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="name">Имя *</label>
            <input 
              id="name"
              v-model="name" 
              type="text" 
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Введите ваш email"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Телефон</label>
            <input 
              id="phone"
              v-model="phone" 
              type="tel" 
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль *</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Минимум 6 символов"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Подтверждение пароля *</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              placeholder="Повторите пароль"
              required
            />
          </div>

          <div class="form-checkbox">
            <label>
              <input type="checkbox" required />
              <span>Я согласен с <a href="#">условиями обработки данных</a></span>
            </label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-lg btn-block" 
            :disabled="loading"
          >
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <div class="register-footer">
          <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  padding: 4rem 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.register-card {
  max-width: 480px;
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

.register-form {
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

.form-checkbox {
  margin-bottom: 1.5rem;
}

.form-checkbox label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-color);
}

.form-checkbox input {
  width: auto;
  margin-top: 0.25rem;
  accent-color: var(--secondary-color);
}

.form-checkbox a {
  color: var(--secondary-color);
}

.btn-block {
  width: 100%;
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-light);
}

.register-footer a {
  color: var(--secondary-color);
  font-weight: 500;
}

@media (max-width: 480px) {
  .register-card {
    padding: 2rem 1.5rem;
  }
}
</style>