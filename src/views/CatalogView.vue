<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'
import type { Category } from '@/types'

const route = useRoute()
const productsStore = useProductsStore()

const selectedCategory = ref<string>('all')
const sortBy = ref<string>('default')
const priceRange = ref<[number, number]>([0, 200000])
const searchQuery = ref<string>('')
const tempCategory = ref<string>('all')
const tempSortBy = ref<string>('default')
const tempPriceRange = ref<[number, number]>([0, 200000])

// Get category from route params
watch(() => route.params.category, (category) => {
  if (category) {
    selectedCategory.value = category as string
    tempCategory.value = category as string
  } else {
    selectedCategory.value = 'all'
    tempCategory.value = 'all'
  }
}, { immediate: true })

// Get search query from route query
watch(() => route.query.search, (search) => {
  if (search) {
    searchQuery.value = search as string
  }
}, { immediate: true })

// Sync temp values with actual values
watch(selectedCategory, (val) => tempCategory.value = val)
watch(sortBy, (val) => tempSortBy.value = val)
watch(priceRange, (val) => tempPriceRange.value = val, { deep: true })

function applyFilters() {
  selectedCategory.value = tempCategory.value
  sortBy.value = tempSortBy.value
  priceRange.value = tempPriceRange.value
}

const categories = computed(() => productsStore.categories)

const filteredProducts = computed(() => {
  let products = [...productsStore.products]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }

  // Filter by price range
  products = products.filter(p => 
    p.price >= priceRange.value[0] && p.price <= priceRange.value[1]
  )

  // Sort
  switch (sortBy.value) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return products
})

const selectedCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'Все товары'
  const category = categories.value.find(c => c.id === selectedCategory.value)
  return category?.name || 'Все товары'
})

function clearFilters() {
  selectedCategory.value = 'all'
  sortBy.value = 'default'
  priceRange.value = [0, 200000]
  searchQuery.value = ''
}
</script>

<template>
  <div class="catalog">
    <div class="container">
      <div class="catalog-header">
        <h1 class="page-title">{{ selectedCategoryName }}</h1>
        <p class="products-count">Найдено товаров: {{ filteredProducts.length }}</p>
      </div>

      <div class="catalog-layout">
        <!-- Sidebar -->
        <aside class="catalog-sidebar">
          <div class="filter-section">
            <h3 class="filter-title">Категории</h3>
            <ul class="filter-list">
              <li>
                <label class="filter-checkbox">
                  <input 
                    type="radio" 
                    v-model="tempCategory" 
                    value="all"
                    name="category"
                  />
                  <span>Все товары</span>
                </label>
              </li>
              <li v-for="category in categories" :key="category.id">
                <label class="filter-checkbox">
                  <input 
                    type="radio" 
                    v-model="tempCategory" 
                    :value="category.id"
                    name="category"
                  />
                  <span>{{ category.name }}</span>
                </label>
              </li>
            </ul>
          </div>

          <div class="filter-section">
            <h3 class="filter-title">Цена, ₽</h3>
            <div class="price-range">
              <div class="price-inputs">
                <input 
                  type="number" 
                  v-model="tempPriceRange[0]" 
                  placeholder="От" 
                  min="0"
                />
                <span>—</span>
                <input 
                  type="number" 
                  v-model="tempPriceRange[1]" 
                  placeholder="До" 
                  min="0"
                />
              </div>
              <input 
                type="range" 
                v-model="tempPriceRange[0]" 
                min="0" 
                max="200000" 
                step="1000"
                class="range-slider"
              />
              <input 
                type="range" 
                v-model="tempPriceRange[1]" 
                min="0" 
                max="200000" 
                step="1000"
                class="range-slider"
              />
            </div>
          </div>

          <button class="btn btn-secondary clear-filters" @click="clearFilters">
            Сбросить фильтры
          </button>
          <button class="btn btn-primary apply-filters" @click="applyFilters">
            Сохранить
          </button>
        </aside>

        <!-- Products Grid -->
        <main class="catalog-main">
          <div class="catalog-toolbar">
            <div class="sort-control">
              <label>Сортировка:</label>
              <select v-model="tempSortBy">
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевые</option>
                <option value="price-desc">Сначала дорогие</option>
                <option value="rating">По рейтингу</option>
                <option value="newest">Сначала новые</option>
              </select>
            </div>
          </div>

          <div v-if="filteredProducts.length > 0" class="products-grid">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product"
            />
          </div>

          <div v-else class="no-products">
            <p>Товары не найдены</p>
            <router-link to="/catalog" class="btn btn-primary">
              Смотреть весь каталог
            </router-link>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog {
  padding: 2rem 0;
}

.catalog-header {
  margin-bottom: 2rem;
}

.products-count {
  color: var(--text-light);
  font-size: 0.875rem;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.catalog-sidebar {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.filter-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.filter-section:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
  padding-bottom: 0;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.filter-list {
  list-style: none;
}

.filter-list li {
  margin-bottom: 0.5rem;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-color);
  transition: var(--transition);
}

.filter-checkbox:hover {
  color: var(--secondary-color);
}

.filter-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--secondary-color);
}

.price-range {
  position: relative;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-inputs input {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

.price-inputs span {
  flex-shrink: 0;
  color: var(--text-light);
}

.range-slider {
  width: 100%;
  margin-top: 0.5rem;
  accent-color: var(--secondary-color);
}

.clear-filters {
  width: 100%;
  margin-top: 1rem;
}

.apply-filters {
  width: 100%;
  margin-top: 0.5rem;
}

.catalog-main {
  min-width: 0;
}

.catalog-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-control label {
  font-size: 0.875rem;
  color: var(--text-light);
  white-space: nowrap;
}

.sort-control select {
  width: auto;
  min-width: 200px;
  padding: 0.5rem 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--white);
  border-radius: var(--radius);
}

.no-products p {
  font-size: 1.125rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .catalog-sidebar {
    position: static;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .catalog-toolbar {
    flex-direction: column;
  }

  .sort-control select {
    width: 100%;
  }
}
</style>