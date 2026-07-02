<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'
import iconProduction from '@/assets/icon-production.png'
import iconEco from '@/assets/icon-eco.png'
import iconDesign from '@/assets/icon-design.png'
import iconFastDelivery from '@/assets/icon-fast-delivery.png'

const productsStore = useProductsStore()

const featuredProducts = computed(() => productsStore.featuredProducts)
const newProducts = computed(() => productsStore.newProducts)
const categories = computed(() => productsStore.categories)
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Создайте уют в вашем доме с САВ Мебель</h1>
          <p class="hero-subtitle">
            Качественная мебель от производителя. Более 14 лет мы создаем комфорт 
            и стиль для тысяч домов по всей России.
          </p>
          <div class="hero-buttons">
            <router-link to="/catalog" class="btn btn-primary btn-lg">
              Смотреть каталог
            </router-link>
            <router-link to="/about" class="btn btn-secondary btn-lg">
              Узнать больше
            </router-link>
          </div>
          <div class="hero-features">
            <div class="feature">
              <!-- ВСТАВИТЬ СЮДА ИКОНКУ ДОСТАВКИ (SVG или img) -->
              <span class="feature-icon icon-delivery"></span>
              <span>Бесплатная доставка от 50 000 ₽</span>
            </div>
            <div class="feature">
              <!-- ВСТАВИТЬ СЮДА ИКОНКУ ГАРАНТИИ (SVG или img) -->
              <span class="feature-icon icon-warranty"></span>
              <span>Гарантия 2 года</span>
            </div>
            <div class="feature">
              <!-- ВСТАВИТЬ СЮДА ИКОНКУ ВОЗВРАТА (SVG или img) -->
              <span class="feature-icon icon-return"></span>
              <span>Возврат 30 дней</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600" alt="Мебель САВ" />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Категории товаров</h2>
        <div class="categories-grid">
          <router-link 
            v-for="category in categories" 
            :key="category.id"
            :to="`/catalog/${category.id}`"
            class="category-card"
          >
            <div class="category-image">
              <img :src="category.image" :alt="category.name" loading="lazy" />
            </div>
            <div class="category-info">
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-description">{{ category.description }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Популярные товары</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="section-footer">
          <router-link to="/catalog" class="btn btn-secondary">
            Смотреть все товары
          </router-link>
        </div>
      </div>
    </section>

    <!-- New Products -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Новинки</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="product in newProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- About Section Preview -->
    <section class="about-preview">
      <div class="container">
        <div class="about-content">
          <h2 class="section-title">Почему выбирают САВ Мебель?</h2>
          <div class="about-features">
            <div class="about-feature">
              <img :src="iconProduction" alt="Производство" class="about-feature-icon" />
              <h3>Собственное производство</h3>
              <p>Контролируем качество на каждом этапе производства</p>
            </div>
            <div class="about-feature">
              <img :src="iconEco" alt="Экология" class="about-feature-icon" />
              <h3>Экологичные материалы</h3>
              <p>Используем только безопасные и сертифицированные материалы</p>
            </div>
            <div class="about-feature">
              <img :src="iconDesign" alt="Дизайн" class="about-feature-icon" />
              <h3>Уникальный дизайн</h3>
              <p>Разрабатываем современные и практичные решения</p>
            </div>
            <div class="about-feature">
              <img :src="iconFastDelivery" alt="Доставка" class="about-feature-icon" />
              <h3>Быстрая доставка</h3>
              <p>Доставляем по всей России в кратчайшие сроки</p>
            </div>
          </div>
          <router-link to="/about" class="btn btn-primary">
            Подробнее о компании
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  padding: 4rem 0;
  margin-top: -2rem;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-secondary {
  background: var(--white);
  color: var(--primary-color);
  border: none;
}

.btn-secondary:hover {
  background: var(--bg-color);
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.25rem;
}

.hero-image {
  position: relative;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.section {
  padding: 4rem 0;
}

.section-footer {
  text-align: center;
  margin-top: 2.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.categories-section {
  background: var(--white);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.category-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}

.category-image {
  height: 180px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image img {
  transform: scale(1.05);
}

.category-info {
  padding: 1.5rem;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.category-description {
  font-size: 0.875rem;
  color: var(--text-light);
  line-height: 1.5;
}

.about-preview {
  background: var(--bg-color);
  padding: 4rem 0;
  margin-top: 2rem;
}

.about-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 3rem 0;
}

.about-feature {
  padding: 1.5rem;
}

.about-feature-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
}

.about-feature h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.about-feature p {
  font-size: 0.875rem;
  color: var(--text-light);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .about-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-content {
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-features {
    justify-content: center;
  }

  .hero-image {
    display: none;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .hero-buttons {
    flex-direction: column;
  }
}
</style>