<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const tabs = [
  { id: 'delivery', label: 'Доставка и оплата' },
  { id: 'warranty', label: 'Гарантия' },
  { id: 'returns', label: 'Возврат' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'Вопрос-ответ' }
]

const activeTab = ref('delivery')

watch(() => route.query.tab, (tab) => {
  if (typeof tab === 'string' && tabs.some(t => t.id === tab)) {
    activeTab.value = tab
  }
}, { immediate: true })

function switchTab(tabId: string) {
  router.push({ query: { tab: tabId } })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getProductName(productId: number): string {
  const product = productsStore.products.find(p => p.id === productId)
  return product?.name || 'Товар'
}

const allReviews = computed(() =>
  [...productsStore.reviews].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
)

const faqItems = [
  {
    q: 'Какие сроки доставки?',
    a: 'Сроки доставки зависят от города и сложности заказа. В среднем доставка по Москве и области занимает 1-3 дня, в регионы — от 3 до 14 дней. Точные сроки согласовываются с менеджером после оформления заказа.'
  },
  {
    q: 'Сколько стоит доставка?',
    a: 'Доставка по Москве в пределах МКАД — бесплатно при заказе от 50 000 ₽. При заказе до 50 000 ₽ стоимость доставки — 1 500 ₽. Доставка в регионы рассчитывается индивидуально.'
  },
  {
    q: 'Как оплатить заказ?',
    a: 'Вы можете оплатить заказ наличными курьеру, банковской картой онлайн, переводом на расчётный счёт, или оформить рассрочку через банки-партнёры.'
  },
  {
    q: 'Можно ли вернуть товар?',
    a: 'Да, вы можете вернуть товар надлежащего качества в течение 30 дней с момента получения. Товар должен быть в оригинальной упаковке, без следов сборки и эксплуатации. Ознакомьтесь с подробными условиями во вкладке "Возврат".'
  },
  {
    q: 'Есть ли гарантия на мебель?',
    a: 'На всю продукцию предоставляется гарантия 2 года. Гарантия распространяется на производственные дефекты. Подробнее — во вкладке "Гарантия".'
  },
  {
    q: 'Как ухаживать за мебелью?',
    a: 'Рекомендуем использовать специальные средства по уходу за мебелью в зависимости от материала. Избегайте попадания прямых солнечных лучей, устанавливайте мебель вдали от отопительных приборов. Для чистки обивки используйте пылесос с мягкой насадкой.'
  }
]
</script>

<template>
  <div class="customers-page">
    <div class="container">
      <h1 class="page-title">Покупателям</h1>

      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Delivery & Payment -->
        <div v-if="activeTab === 'delivery'" class="content-card">
          <h2>Доставка</h2>
          <div class="info-block">
            <h3>По Москве и Московской области</h3>
            <ul>
              <li>Доставка в пределах МКАД — <strong>бесплатно</strong> при заказе от 50 000 ₽</li>
              <li>При заказе до 50 000 ₽ стоимость доставки — 1 500 ₽</li>
              <li>Доставка за МКАД — +30 ₽ за каждый километр</li>
              <li>Подъем на этаж без лифта — 200 ₽ за единицу товара</li>
            </ul>
          </div>
          <div class="info-block">
            <h3>В регионы России</h3>
            <ul>
              <li>Доставка осуществляется транспортными компаниями (ПЭК, Деловые Линии, СДЭК)</li>
              <li>Стоимость рассчитывается индивидуально и зависит от габаритов заказа</li>
              <li>Срок доставки — от 3 до 14 рабочих дней</li>
            </ul>
          </div>

          <h2>Оплата</h2>
          <div class="info-block">
            <ul>
              <li><strong>Наличные</strong> — оплата курьеру при получении</li>
              <li><strong>Банковская карта</strong> — Visa, Mastercard, МИР на сайте или при получении</li>
              <li><strong>Безналичный расчёт</strong> — для юридических лиц по счёту</li>
              <li><strong>Рассрочка</strong> — от 0% на 6 месяцев через банки-партнёры</li>
            </ul>
          </div>
        </div>

        <!-- Warranty -->
        <div v-if="activeTab === 'warranty'" class="content-card">
          <h2>Гарантия на мебель</h2>
          <div class="info-block">
            <p>На всю продукцию "САВ Мебель" предоставляется гарантия <strong>2 года</strong> с момента получения товара.</p>
            <h3>Гарантийные обязательства</h3>
            <ul>
              <li>Производственные дефекты каркаса и фурнитуры</li>
              <li>Отслоение облицовочного материала (шпона, плёнки)</li>
              <li>Деформация элементов при соблюдении условий эксплуатации</li>
              <li>Неисправность механизмов трансформации</li>
            </ul>
          </div>
          <div class="info-block">
            <h3>Не распространяется на:</h3>
            <ul>
              <li>Механические повреждения, возникшие после передачи товара</li>
              <li>Естественный износ обивки и наполнителя</li>
              <li>Повреждения, вызванные неправильной эксплуатацией</li>
              <li>Изменение цвета ткани под воздействием солнечных лучей</li>
            </ul>
          </div>
          <div class="info-block">
            <h3>Как оформить гарантийный случай?</h3>
            <ol>
              <li>Свяжитесь с нами по телефону или в мессенджерах</li>
              <li>Опишите проблему и приложите фото</li>
              <li>Наш специалист свяжется с вами в течение 24 часов</li>
              <li>При необходимости организуем выезд мастера</li>
            </ol>
          </div>
        </div>

        <!-- Returns -->
        <div v-if="activeTab === 'returns'" class="content-card">
          <h2>Условия возврата</h2>
          <div class="info-block">
            <p>Вы можете вернуть товар надлежащего качества в течение <strong>30 дней</strong> с момента получения.</p>
            <h3>Условия возврата:</h3>
            <ul>
              <li>Товар не был в употреблении, сохранены товарный вид и потребительские свойства</li>
              <li>Сохранена оригинальная упаковка</li>
              <li>Отсутствуют следы сборки и эксплуатации</li>
              <li>Сохранены фабричные ярлыки и пломбы</li>
              <li>Наличие документов, подтверждающих покупку</li>
            </ul>
          </div>
          <div class="info-block">
            <h3>Возврат товара ненадлежащего качества</h3>
            <p>При обнаружении производственного брака вы можете вернуть или обменять товар в течение гарантийного срока.</p>
            <ul>
              <li>Полный возврат стоимости товара и доставки</li>
              <li>Бесплатная замена на аналогичный товар</li>
              <li>Выезд специалиста для оценки брака</li>
            </ul>
          </div>
          <div class="info-block">
            <h3>Процедура возврата</h3>
            <ol>
              <li>Свяжитесь с нами для оформления заявления на возврат</li>
              <li>Подготовьте товар к возврату в оригинальной упаковке</li>
              <li>Передайте товар курьеру или отправьте транспортной компанией</li>
              <li>Возврат средств осуществляется в течение 10 рабочих дней</li>
            </ol>
          </div>
        </div>

        <!-- Reviews -->
        <div v-if="activeTab === 'reviews'" class="content-card">
          <h2>Отзывы наших клиентов</h2>
          <div v-if="allReviews.length > 0" class="reviews-list">
            <div v-for="review in allReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-author">
                  <div class="author-avatar">{{ review.userName.charAt(0) }}</div>
                  <div class="author-info">
                    <span class="author-name">{{ review.userName }}</span>
                    <span class="review-product">на товар: {{ getProductName(review.productId) }}</span>
                  </div>
                </div>
                <div class="review-date">{{ formatDate(review.createdAt) }}</div>
              </div>
              <div class="review-rating">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
          <p v-else class="no-data">Отзывов пока нет. Будьте первыми, кто оставит отзыв!</p>
        </div>

        <!-- FAQ -->
        <div v-if="activeTab === 'faq'" class="content-card">
          <h2>Часто задаваемые вопросы</h2>
          <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
            <details>
              <summary>{{ item.q }}</summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customers-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--secondary-color);
}

.tab-btn.active {
  color: var(--secondary-color);
  border-bottom-color: var(--secondary-color);
}

.content-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.content-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.content-card h2:not(:first-child) {
  margin-top: 2rem;
}

.info-block {
  margin-bottom: 1.5rem;
}

.info-block h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

.info-block p {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

.info-block ul,
.info-block ol {
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.info-block li {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-color);
  margin-bottom: 0.375rem;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-item {
  padding: 1.25rem;
  background: var(--bg-color);
  border-radius: var(--radius);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background: var(--secondary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--primary-color);
}

.review-product {
  font-size: 0.8rem;
  color: var(--text-light);
}

.review-date {
  font-size: 0.8rem;
  color: var(--text-light);
  white-space: nowrap;
}

.review-rating {
  color: var(--warning-color);
  margin-bottom: 0.5rem;
}

.star {
  font-size: 1rem;
}

.star.filled {
  color: var(--warning-color);
}

.star:not(.filled) {
  color: var(--border-color);
}

.review-comment {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-color);
}

.no-data {
  text-align: center;
  color: var(--text-light);
  padding: 2rem;
}

/* FAQ */
.faq-item {
  border-bottom: 1px solid var(--border-color);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item details {
  padding: 1rem 0;
}

.faq-item summary {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem 0;
  transition: var(--transition);
}

.faq-item summary:hover {
  color: var(--secondary-color);
}

.faq-item p {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-color);
  padding: 0.75rem 0 0.5rem 1rem;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
    border-bottom: none;
  }

  .tab-btn {
    border-bottom: none;
    border-left: 2px solid transparent;
    margin-bottom: 0;
    margin-left: -2px;
  }

  .tab-btn.active {
    border-left-color: var(--secondary-color);
    border-bottom: none;
  }

  .content-card {
    padding: 1.25rem;
  }

  .review-header {
    flex-direction: column;
  }
}
</style>
