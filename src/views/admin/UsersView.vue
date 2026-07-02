<script setup lang="ts">
import { computed } from 'vue'
import { mockUsers } from '@/data/mockData'

const users = computed(() => mockUsers)

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function viewUser(userId: number) {
  const user = mockUsers.find(u => u.id === userId)
  if (user) {
    alert(`Пользователь:\nИмя: ${user.name}\nEmail: ${user.email}\nТелефон: ${user.phone || 'Не указан'}\nРоль: ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}`)
  }
}

function editUser(userId: number) {
  const user = mockUsers.find(u => u.id === userId)
  if (user) {
    const newName = prompt('Введите новое имя:', user.name)
    if (newName) {
      user.name = newName
      alert(`Имя пользователя обновлено на: ${newName}`)
    }
  }
}
</script>

<template>
  <div class="admin-users-page">
    <div class="container">
      <h1 class="page-title">Управление пользователями</h1>
      <p class="page-subtitle">{{ users.length }} пользователей</p>

      <div class="users-table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || '—' }}</td>
              <td>
                <span :class="['badge', user.role === 'admin' ? 'badge-error' : 'badge-info']">
                  {{ user.role === 'admin' ? 'Администратор' : 'Пользователь' }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td class="actions-cell">
                <button class="btn btn-sm btn-secondary" @click="viewUser(user.id)">
                  Просмотр
                </button>
                <button class="btn btn-sm btn-secondary" @click="editUser(user.id)">
                  Редактировать
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-users-page {
  padding: 2rem 0;
}

.page-subtitle {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.users-table-wrapper {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.users-table th {
  background: var(--bg-color);
  font-weight: 600;
  color: var(--text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
}

.users-table tr:hover {
  background: var(--bg-color);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--secondary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .users-table-wrapper {
    overflow-x: auto;
  }

  .users-table {
    min-width: 700px;
  }
}
</style>