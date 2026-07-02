<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'

const productsStore = useProductsStore()
const products = computed(() => productsStore.products)
const categories = computed(() => productsStore.categories)

const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const searchQuery = ref('')

const formData = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  images: [''],
  inStock: true,
  specifications: {} as Record<string, string>
})

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function openAddModal() {
  editingProduct.value = null
  formData.value = {
    name: '',
    description: '',
    price: 0,
    category: categories.value[0]?.id || '',
    images: [''],
    inStock: true,
    specifications: {}
  }
  showModal.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = product
  formData.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: [...product.images],
    inStock: product.inStock,
    specifications: { ...product.specifications }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
}

function submitForm() {
  if (!formData.value.name || !formData.value.price) {
    alert('Заполните обязательные поля')
    return
  }

  if (editingProduct.value) {
    productsStore.updateProduct(editingProduct.value.id, {
      ...formData.value,
      images: formData.value.images.filter(img => img)
    })
  } else {
    productsStore.addProduct({
      ...formData.value,
      images: formData.value.images.filter(img => img)
    })
  }

  closeModal()
}

function deleteProduct(id: number) {
  if (confirm('Вы уверены, что хотите удалить этот товар?')) {
    productsStore.deleteProduct(id)
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="admin-products-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Управление товарами</h1>
          <p class="page-subtitle">{{ products.length }} товаров в каталоге</p>
        </div>
        <button class="btn btn-primary" @click="openAddModal">
          + Добавить товар
        </button>
      </div>

      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск товаров..."
        />
      </div>

      <div class="products-table-wrapper">
        <table class="products-table">
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Рейтинг</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <img :src="product.images[0]" :alt="product.name" class="product-thumb" />
              </td>
              <td>
                <div class="product-name-cell">
                  <strong>{{ product.name }}</strong>
                  <span class="product-desc">{{ product.description.slice(0, 60) }}...</span>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ categories.find(c => c.id === product.category)?.name || product.category }}</span>
              </td>
              <td class="price-cell">{{ formatPrice(product.price) }}</td>
              <td>
                <span :class="['badge', product.inStock ? 'badge-success' : 'badge-error']">
                  {{ product.inStock ? 'В наличии' : 'Нет' }}
                </span>
              </td>
              <td>
                <div class="rating-cell">
                  <span class="stars">★</span>
                  <span>{{ product.rating.toFixed(1) }}</span>
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn btn-sm btn-secondary" @click="openEditModal(product)">
                  ✏️
                </button>
                <button class="btn btn-sm btn-accent" @click="deleteProduct(product.id)">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>{{ editingProduct ? 'Редактирование' : 'Добавление' }} товара</h2>
            <button class="modal-close" @click="closeModal">✕</button>
          </div>

          <form @submit.prevent="submitForm" class="modal-body">
            <div class="form-group">
              <label>Название *</label>
              <input v-model="formData.name" type="text" required />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="formData.description" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Цена *</label>
                <input v-model.number="formData.price" type="number" min="0" required />
              </div>
              <div class="form-group">
                <label>Категория</label>
                <select v-model="formData.category">
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Изображения (URL)</label>
              <div v-for="(img, index) in formData.images" :key="index" class="image-input-row">
                <input v-model="formData.images[index]" type="text" :placeholder="`URL изображения ${index + 1}`" />
                <button type="button" @click="formData.images.splice(index, 1)" v-if="formData.images.length > 1">✕</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm mt-1" @click="formData.images.push('')">
                + Добавить изображение
              </button>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.inStock" />
                <span>Товар в наличии</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                {{ editingProduct ? 'Сохранить' : 'Создать' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-products-page {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-subtitle {
  color: var(--text-light);
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-bar input {
  max-width: 400px;
}

.products-table-wrapper {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.products-table th {
  background: var(--bg-color);
  font-weight: 600;
  color: var(--text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
}

.products-table tr:hover {
  background: var(--bg-color);
}

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
}

.product-name-cell strong {
  display: block;
  margin-bottom: 0.25rem;
}

.product-desc {
  font-size: 0.75rem;
  color: var(--text-light);
}

.category-badge {
  background: var(--bg-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.price-cell {
  font-weight: 600;
  color: var(--accent-color);
}

.rating-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stars {
  color: var(--warning-color);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.actions-cell .btn {
  padding: 0.25rem 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--white);
  border-radius: var(--radius);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.image-input-row button {
  flex-shrink: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.mt-1 { margin-top: 0.5rem; }

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .products-table-wrapper {
    overflow-x: auto;
  }

  .products-table {
    min-width: 800px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>