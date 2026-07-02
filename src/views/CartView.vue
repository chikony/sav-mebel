<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)
const totalCount = computed(() => cartStore.totalCount)
const totalPrice = computed(() => cartStore.totalPrice)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function updateQuantity(productId: number, quantity: number) {
  cartStore.updateQuantity(productId, quantity)
}

function removeItem(productId: number) {
  cartStore.removeFromCart(productId)
}

function proceedToCheckout() {
  router.push('/checkout')
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Корзина</h1>

      <div v-if="cartItems.length > 0" class="cart-layout">
        <div class="cart-items">
          <div class="cart-header">
            <span class="col-product">Товар</span>
            <span class="col-price">Цена</span>
            <span class="col-quantity">Количество</span>
            <span class="col-total">Сумма</span>
            <span class="col-actions"></span>
          </div>

          <div v-for="item in cartItems" :key="item.productId" class="cart-item">
            <div class="item-product">
              <img :src="item.product.images[0]" :alt="item.product.name" class="item-image" />
              <div class="item-info">
                <router-link :to="`/product/${item.productId}`" class="item-name">
                  {{ item.product.name }}
                </router-link>
                <span class="item-category">{{ item.product.category }}</span>
              </div>
            </div>

            <div class="item-price">
              {{ formatPrice(item.product.price) }}
            </div>

            <div class="item-quantity">
              <button @click="updateQuantity(item.productId, item.quantity - 1)">−</button>
              <input 
                type="number" 
                :value="item.quantity" 
                @change="updateQuantity(item.productId, Number(($event.target as HTMLInputElement).value))"
                min="1" 
                max="10"
              />
              <button @click="updateQuantity(item.productId, item.quantity + 1)">+</button>
            </div>

            <div class="item-total">
              {{ formatPrice(item.product.price * item.quantity) }}
            </div>

            <button class="item-remove" @click="removeItem(item.productId)">
              ✕
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Итого</h2>
          <div class="summary-row">
            <span>Товары ({{ totalCount }} шт.)</span>
            <span>{{ formatPrice(totalPrice) }}</span>
          </div>
          <div class="summary-row">
            <span>Доставка</span>
            <span v-if="totalPrice >= 50000" class="free-delivery">Бесплатно</span>
            <span v-else>{{ formatPrice(500) }}</span>
          </div>
          <div class="summary-total">
            <span>К оплате</span>
            <span class="total-price">{{ formatPrice(totalPrice + (totalPrice >= 50000 ? 0 : 500)) }}</span>
          </div>
          <button class="btn btn-primary btn-lg btn-block" @click="proceedToCheckout">
            Оформить заказ
          </button>
          <router-link to="/catalog" class="btn btn-secondary btn-block">
            Продолжить покупки
          </router-link>
        </div>
      </div>

      <div v-else class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        <router-link to="/catalog" class="btn btn-primary">
          Перейти в каталог
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 2rem 0;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
}

.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 50px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-color);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-light);
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 50px;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-product {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  line-height: 1.4;
}

.item-name:hover {
  color: var(--secondary-color);
}

.item-category {
  font-size: 0.75rem;
  color: var(--text-light);
  text-transform: capitalize;
}

.item-price {
  font-weight: 600;
  color: var(--accent-color);
}

.item-quantity {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
  width: fit-content;
}

.item-quantity button {
  width: 32px;
  height: 32px;
  background: var(--bg-color);
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.item-quantity button:hover {
  background: var(--border-color);
}

.item-quantity input {
  width: 48px;
  height: 32px;
  border: none;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  -moz-appearance: textfield;
}

.item-quantity input::-webkit-outer-spin-button,
.item-quantity input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.item-total {
  font-weight: 700;
  color: var(--accent-color);
}

.item-remove {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-light);
  cursor: pointer;
  padding: 0.5rem;
  transition: var(--transition);
}

.item-remove:hover {
  color: var(--accent-color);
}

.cart-summary {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  position: sticky;
  top: 100px;
}

.cart-summary h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.free-delivery {
  color: var(--success-color);
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
  margin: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  font-size: 1.125rem;
  font-weight: 600;
}

.total-price {
  font-size: 1.5rem;
  color: var(--accent-color);
}

.btn-block {
  width: 100%;
  margin-bottom: 0.75rem;
}

.btn-block:last-child {
  margin-bottom: 0;
}

.cart-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.cart-empty h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.cart-empty p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item-product {
    order: 1;
  }

  .item-price {
    order: 2;
  }

  .item-price::before {
    content: 'Цена: ';
    color: var(--text-light);
    font-weight: normal;
  }

  .item-quantity {
    order: 3;
  }

  .item-total {
    order: 4;
  }

  .item-total::before {
    content: 'Сумма: ';
    color: var(--text-light);
    font-weight: normal;
  }

  .item-remove {
    order: 5;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }

  .cart-item {
    position: relative;
    padding-right: 3rem;
  }
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}
</style>