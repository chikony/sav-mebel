<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import type { Review } from '@/types'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const productId = computed(() => Number(route.params.id))
const product = computed(() => productsStore.getProductById(productId.value))
const reviews = computed(() => productsStore.getProductReviews(productId.value))

const selectedImage = ref(0)
const quantity = ref(1)
const rating = ref(5)
const comment = ref('')
const showReviewForm = ref(false)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productsStore.products
    .filter(p => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4)
})

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function addToCart() {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value)
  }
}

function buyNow() {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value)
    router.push('/checkout')
  }
}

function submitReview() {
  if (!authStore.isAuthenticated) {
    alert('Пожалуйста, войдите в систему, чтобы оставить отзыв')
    router.push('/login')
    return
  }

  if (comment.value.trim() && product.value) {
    productsStore.addReview({
      productId: product.value.id,
      userId: authStore.user?.id || 1,
      userName: authStore.userName,
      rating: rating.value,
      comment: comment.value.trim()
    })
    comment.value = ''
    rating.value = 5
    showReviewForm.value = false
    alert('Спасибо за ваш отзыв!')
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  if (!product.value) {
    router.push('/catalog')
  }
})
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <router-link to="/">Главная</router-link>
        <span>/</span>
        <router-link to="/catalog">Каталог</router-link>
        <span>/</span>
        <span>{{ product.name }}</span>
      </nav>

      <!-- Product Main -->
      <div class="product-main">
        <div class="product-gallery">
          <div class="gallery-main">
            <img :src="product.images[selectedImage]" :alt="product.name" />
          </div>
          <div v-if="product.images.length > 1" class="gallery-thumbs">
            <button 
              v-for="(image, index) in product.images" 
              :key="index"
              :class="['thumb', { active: selectedImage === index }]"
              @click="selectedImage = index"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          
          <div class="product-meta">
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= Math.round(product.rating) ? '★' : '☆' }}
              </span>
              <span class="rating-value">{{ product.rating }}</span>
              <router-link :to="`#reviews`" class="reviews-link">
                ({{ product.reviewCount }} отзывов)
              </router-link>
            </div>
            <span v-if="product.inStock" class="badge badge-success">В наличии</span>
            <span v-else class="badge badge-error">Нет в наличии</span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <div class="product-price-block">
            <span class="product-price">{{ formatPrice(product.price) }}</span>
          </div>

          <div class="product-actions">
            <div class="quantity-control">
              <button @click="quantity = Math.max(1, quantity - 1)">−</button>
              <input type="number" v-model.number="quantity" min="1" max="10" />
              <button @click="quantity = Math.min(10, quantity + 1)">+</button>
            </div>
            <button 
              class="btn btn-primary btn-lg" 
              @click="addToCart"
              :disabled="!product.inStock"
            >
              В корзину
            </button>
            <button 
              class="btn btn-accent btn-lg" 
              @click="buyNow"
              :disabled="!product.inStock"
            >
              Купить сейчас
            </button>
          </div>

          <!-- Specifications -->
          <div class="product-specs">
            <h3>Характеристики</h3>
            <table class="specs-table">
              <tr v-for="(value, key) in product.specifications" :key="key">
                <td class="spec-label">{{ key }}</td>
                <td class="spec-value">{{ value }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section id="reviews" class="reviews-section">
        <h2 class="section-title">Отзывы ({{ reviews.length }})</h2>

        <div v-if="reviews.length > 0" class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="review-author">
                <div class="author-avatar">{{ review.userName.charAt(0) }}</div>
                <div class="author-info">
                  <span class="author-name">{{ review.userName }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </div>
              </div>
              <div class="review-rating">
                <span v-for="i in 5" :key="i" :class="['star', { filled: i <= review.rating }]">
                  ★
                </span>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
        <p v-else class="no-reviews">Отзывов пока нет. Будьте первыми!</p>

        <div class="review-form-container">
          <button 
            v-if="!showReviewForm" 
            class="btn btn-secondary" 
            @click="showReviewForm = true"
          >
            Оставить отзыв
          </button>

          <form v-else @submit.prevent="submitReview" class="review-form">
            <h3>Написать отзыв</h3>
            
            <div class="form-group">
              <label>Ваша оценка</label>
              <div class="rating-input">
                <button 
                  v-for="i in 5" 
                  :key="i"
                  type="button"
                  :class="['star-btn', { active: i <= rating }]"
                  @click="rating = i"
                >
                  ★
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="comment">Комментарий</label>
              <textarea 
                id="comment" 
                v-model="comment" 
                rows="4" 
                placeholder="Расскажите о вашем опыте использования товара..."
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Отправить отзыв</button>
              <button type="button" class="btn btn-secondary" @click="showReviewForm = false">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" class="related-section">
        <h2 class="section-title">Похожие товары</h2>
        <div class="products-grid">
          <router-link 
            v-for="p in relatedProducts" 
            :key="p.id"
            :to="`/product/${p.id}`"
            class="product-card card"
          >
            <div class="product-image">
              <img :src="p.images[0]" :alt="p.name" />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ p.name }}</h3>
              <p class="product-price">{{ formatPrice(p.price) }}</p>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="loading">
    <p>Загрузка...</p>
  </div>
</template>

<style scoped>
.product-page {
  padding: 2rem 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.breadcrumbs a {
  color: var(--text-light);
}

.breadcrumbs a:hover {
  color: var(--secondary-color);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.gallery-main {
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1rem;
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-thumbs {
  display: flex;
  gap: 0.75rem;
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: var(--radius);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: var(--transition);
}

.thumb.active,
.thumb:hover {
  border-color: var(--secondary-color);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--warning-color);
}

.star {
  font-size: 1.25rem;
}

.rating-value {
  color: var(--text-color);
  font-weight: 600;
  margin-left: 0.5rem;
}

.reviews-link {
  color: var(--text-light);
  margin-left: 0.25rem;
}

.reviews-link:hover {
  color: var(--secondary-color);
}

.product-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.product-price-block {
  margin-bottom: 1.5rem;
}

.product-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.quantity-control button {
  width: 40px;
  height: 40px;
  background: var(--bg-color);
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  transition: var(--transition);
}

.quantity-control button:hover {
  background: var(--border-color);
}

.quantity-control input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  -moz-appearance: textfield;
}

.quantity-control input::-webkit-outer-spin-button,
.quantity-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.product-specs {
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: var(--radius);
}

.product-specs h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid var(--border-color);
}

.specs-table tr:last-child {
  border-bottom: none;
}

.specs-table td {
  padding: 0.75rem 0;
}

.spec-label {
  color: var(--text-light);
  font-size: 0.875rem;
  width: 40%;
}

.spec-value {
  font-weight: 500;
}

/* Reviews Section */
.reviews-section {
  margin-bottom: 4rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.review-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: var(--secondary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--primary-color);
}

.review-date {
  font-size: 0.75rem;
  color: var(--text-light);
}

.review-rating {
  color: var(--warning-color);
}

.review-rating .star {
  font-size: 1rem;
}

.review-rating .star.filled {
  color: var(--warning-color);
}

.review-rating .star:not(.filled) {
  color: var(--border-color);
}

.review-comment {
  line-height: 1.6;
  color: var(--text-color);
}

.no-reviews {
  text-align: center;
  color: var(--text-light);
  padding: 2rem;
}

.review-form-container {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.review-form h3 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.star-btn.active,
.star-btn:hover {
  color: var(--warning-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* Related Products */
.related-section {
  margin-top: 4rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-card .product-image {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius) var(--radius) 0 0;
}

.product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-card .product-info {
  padding: 1rem;
}

.product-card .product-name {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.product-card .product-price {
  font-size: 1.125rem;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-name {
    font-size: 1.5rem;
  }

  .product-actions {
    flex-wrap: wrap;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-actions {
    flex-direction: column;
  }

  .quantity-control {
    width: 100%;
    justify-content: center;
  }

  .product-actions .btn {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>