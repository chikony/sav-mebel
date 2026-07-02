<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const totalCount = computed(() => cartStore.totalCount)

const formData = ref({
  name: authStore.user?.name || '',
  phone: authStore.user?.phone || '',
  email: authStore.user?.email || '',
  address: '',
  city: 'Москва',
  postalCode: '',
  paymentMethod: 'card' as 'card' | 'cash'
})

const errors = ref<Record<string, string>>({})
const showSuccessModal = ref(false)
const createdOrderId = ref(0)

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

function validateForm(): boolean {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Введите имя'
  }
  
  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Введите телефон'
  }
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Введите email'
  }
  
  if (!formData.value.address.trim()) {
    errors.value.address = 'Введите адрес'
  }
  
  if (!formData.value.city.trim()) {
    errors.value.city = 'Введите город'
  }
  
  if (!formData.value.postalCode.trim()) {
    errors.value.postalCode = 'Введите индекс'
  }
  
  return Object.keys(errors.value).length === 0
}

async function submitOrder() {
  if (!validateForm()) {
    return
  }

  const order = cartStore.createOrder({
    name: formData.value.name,
    phone: formData.value.phone,
    address: formData.value.address,
    city: formData.value.city,
    postalCode: formData.value.postalCode
  }, formData.value.paymentMethod)

  createdOrderId.value = order.id
  showSuccessModal.value = true
}

function closeSuccessModal() {
  showSuccessModal.value = false
  router.push('/profile/orders')
}
</script>

<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Оформление заказа</h1>

      <div class="checkout-layout">
        <div class="checkout-form-section">
          <form @submit.prevent="submitOrder">
            <section class="checkout-section">
              <h2>Контактная информация</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Имя *</label>
                  <input 
                    id="name"
                    v-model="formData.name" 
                    type="text" 
                    placeholder="Иван Иванов"
                    :class="{ error: errors.name }"
                  />
                  <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
                </div>
                
                <div class="form-group">
                  <label for="phone">Телефон *</label>
                  <input 
                    id="phone"
                    v-model="formData.phone" 
                    type="tel" 
                    placeholder="+7 (999) 123-45-67"
                    :class="{ error: errors.phone }"
                  />
                  <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  id="email"
                  v-model="formData.email" 
                  type="email" 
                  placeholder="example@mail.ru"
                  :class="{ error: errors.email }"
                />
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>
            </section>

            <section class="checkout-section">
              <h2>Адрес доставки</h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="city">Город *</label>
                  <input 
                    id="city"
                    v-model="formData.city" 
                    type="text" 
                    placeholder="Москва"
                    :class="{ error: errors.city }"
                  />
                  <span v-if="errors.city" class="form-error">{{ errors.city }}</span>
                </div>
                
                <div class="form-group">
                  <label for="postalCode">Индекс *</label>
                  <input 
                    id="postalCode"
                    v-model="formData.postalCode" 
                    type="text" 
                    placeholder="101000"
                    :class="{ error: errors.postalCode }"
                  />
                  <span v-if="errors.postalCode" class="form-error">{{ errors.postalCode }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="address">Улица, дом, квартира *</label>
                <input 
                  id="address"
                  v-model="formData.address" 
                  type="text" 
                  placeholder="ул. Примерная, д. 10, кв. 5"
                  :class="{ error: errors.address }"
                />
                <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
              </div>
            </section>

            <section class="checkout-section">
              <h2>Способ оплаты</h2>
              
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" v-model="formData.paymentMethod" value="card" />
                  <div class="payment-content">
                    <span class="payment-icon">💳</span>
                    <div class="payment-info">
                      <strong>Банковская карта</strong>
                      <span>Visa, Mastercard, MIR</span>
                    </div>
                  </div>
                </label>

                <label class="payment-option">
                  <input type="radio" v-model="formData.paymentMethod" value="cash" />
                  <div class="payment-content">
                    <span class="payment-icon">💵</span>
                    <div class="payment-info">
                      <strong>Наличными</strong>
                      <span>При получении</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <button type="submit" class="btn btn-primary btn-lg btn-block">
              Подтвердить заказ
            </button>
          </form>
        </div>

        <aside class="checkout-summary">
          <h2>Ваш заказ</h2>
          
          <div class="order-items">
            <div v-for="item in cartItems" :key="item.productId" class="order-item">
              <img :src="item.product.images[0]" :alt="item.product.name" />
              <div class="order-item-info">
                <span class="order-item-name">{{ item.product.name }}</span>
                <span class="order-item-qty">{{ item.quantity }} шт.</span>
              </div>
              <span class="order-item-price">{{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span>Товары ({{ totalCount }} шт.)</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="total-row">
              <span>Доставка</span>
              <span v-if="totalPrice >= 50000" class="free">Бесплатно</span>
              <span v-else>{{ formatPrice(500) }}</span>
            </div>
            <div class="total-row total">
              <span>Итого</span>
              <span>{{ formatPrice(totalPrice + (totalPrice >= 50000 ? 0 : 500)) }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon">✓</div>
        <h2>Заказ успешно оформлен!</h2>
        <p class="success-order-id">Номер вашего заказа: #{{ createdOrderId }}</p>
        <p class="success-message">
          Благодарим вас за покупку! Мы свяжемся с вами в ближайшее время 
          для подтверждения доставки.
        </p>
        <button class="btn btn-primary btn-lg" @click="closeSuccessModal">
          Перейти к моим заказам
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  padding: 2rem 0;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.checkout-section {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.checkout-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input.error {
  border-color: var(--error-color);
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  cursor: pointer;
}

.payment-option input {
  display: none;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  transition: var(--transition);
}

.payment-option input:checked + .payment-content {
  border-color: var(--secondary-color);
  background: rgba(52, 152, 219, 0.05);
}

.payment-icon {
  font-size: 2rem;
}

.payment-info {
  display: flex;
  flex-direction: column;
}

.payment-info strong {
  color: var(--text-color);
}

.payment-info span {
  font-size: 0.875rem;
  color: var(--text-light);
}

.checkout-summary {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  position: sticky;
  top: 100px;
}

.checkout-summary h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.order-items {
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
}

.order-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-item-name {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
}

.order-item-qty {
  font-size: 0.75rem;
  color: var(--text-light);
}

.order-item-price {
  font-weight: 600;
  color: var(--accent-color);
  white-space: nowrap;
}

.order-totals {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.total-row.total {
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.total-row.total span:last-child {
  color: var(--accent-color);
  font-size: 1.5rem;
}

.total-row .free {
  color: var(--success-color);
  font-weight: 600;
}

.btn-block {
  width: 100%;
  margin-top: 1.5rem;
}

/* Modal Styles */
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

.success-modal {
  background: var(--white);
  padding: 3rem;
  border-radius: var(--radius);
  text-align: center;
  max-width: 450px;
  box-shadow: var(--shadow-hover);
}

.success-icon {
  width: 80px;
  height: 80px;
  background: var(--success-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
}

.success-modal h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.success-order-id {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.success-message {
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>