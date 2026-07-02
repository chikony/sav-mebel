<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const cartItem = computed(() =>
  cartStore.items.find(item => item.productId === props.product.id)
)

const quantity = computed(() => cartItem.value?.quantity ?? 0)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function add(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  cartStore.addToCart(props.product, 1)
}

function increment(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  cartStore.addToCart(props.product, 1)
}

function decrement(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (quantity.value <= 1) {
    cartStore.removeFromCart(props.product.id)
  } else {
    cartStore.updateQuantity(props.product.id, quantity.value - 1)
  }
}
</script>

<template>
  <router-link :to="`/product/${product.id}`" class="product-card card">
    <div class="product-image">
      <img :src="product.images[0]" :alt="product.name" loading="lazy" />
      <span v-if="!product.inStock" class="out-of-stock">Нет в наличии</span>
      <button
        v-if="product.inStock && quantity === 0"
        class="add-to-cart-btn"
        @click="add"
      >
        +
      </button>
      <div v-if="quantity > 0" class="cart-controls" @click.prevent>
        <button class="ctrl-btn" @click="decrement">−</button>
        <span class="ctrl-qty">{{ quantity }}</span>
        <button class="ctrl-btn" @click="increment">+</button>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-meta">
        <div class="rating">
          <span v-for="i in 5" :key="i" class="star">
            {{ i <= Math.round(product.rating) ? '★' : '☆' }}
          </span>
          <span class="rating-count">({{ product.reviewCount }})</span>
        </div>
      </div>
      <p class="product-price">{{ formatPrice(product.price) }}</p>
    </div>
  </router-link>
</template>

<style scoped>
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.out-of-stock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.add-to-cart-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--secondary-color);
  color: var(--white);
  border: none;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.add-to-cart-btn:hover {
  background: var(--primary-color);
  transform: scale(1.1);
}

.cart-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--white);
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--secondary-color);
  color: var(--white);
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.ctrl-btn:hover {
  background: var(--primary-color);
}

.ctrl-qty {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-color);
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--warning-color);
  font-size: 0.875rem;
}

.star {
  font-size: 0.875rem;
}

.rating-count {
  color: var(--text-light);
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
}
</style>