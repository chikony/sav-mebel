<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const showNotification = ref(false)

watch(() => cartStore.lastAddedProduct, (product) => {
  if (product) {
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
})

function closeNotification() {
  showNotification.value = false
}

function goToCart() {
  showNotification.value = false
  router.push('/cart')
}
</script>

<template>
  <transition name="slide-in">
    <div v-if="showNotification" class="cart-notification">
      <div class="notification-content">
        <div class="notification-icon">✓</div>
        <div class="notification-text">
          <p class="notification-title">Товар добавлен в корзину</p>
          <p v-if="cartStore.lastAddedProduct" class="notification-product">{{ cartStore.lastAddedProduct.name }}</p>
        </div>
      </div>
      <div class="notification-actions">
        <button class="btn btn-secondary btn-sm" @click="closeNotification">
          Продолжить покупки
        </button>
        <button class="btn btn-primary btn-sm" @click="goToCart">
          Оформить заказ
        </button>
      </div>
      <button class="notification-close" @click="closeNotification">✕</button>
    </div>
  </transition>
</template>

<style scoped>
.cart-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-hover);
  padding: 1.5rem;
  z-index: 1000;
  max-width: 350px;
  border-left: 4px solid var(--success-color);
}

.notification-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.notification-icon {
  width: 40px;
  height: 40px;
  background: var(--success-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.notification-product {
  font-size: 0.875rem;
  color: var(--text-light);
}

.notification-actions {
  display: flex;
  gap: 0.75rem;
}

.notification-actions .btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.notification-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.notification-close:hover {
  color: var(--text-color);
}

/* Slide-in animation */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-in-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 480px) {
  .cart-notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>