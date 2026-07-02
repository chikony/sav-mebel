<script setup lang="ts">
import iconQuality from '@/assets/icon-quality.png'
import iconReliability from '@/assets/icon-reliability.png'
import iconInnovation from '@/assets/icon-innovation.png'
import iconEco from '@/assets/icon-eco.png'
import teamMikhail from '@/assets/team-mikhail.jpg'
import teamDmitry from '@/assets/team-dmitry.jpg'

const team = [
  { name: 'Михаил Кукушкин', role: 'Генеральный директор', image: teamDmitry },
  { name: 'Елена Петрова', role: 'Дизайнер', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { name: 'Дмитрий Соколов', role: 'Технолог', image: teamMikhail },
  { name: 'Ольга Морозова', role: 'Менеджер по продажам', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' }
]

const stats = [
  { value: '14+', label: 'Лет на рынке' },
  { value: '50 000+', label: 'Довольных клиентов' },
  { value: '85', label: 'Городов доставки' }
]
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="page-title">О компании САВ Мебель</h1>
          <p class="hero-text">
            Мы создаем уют и комфорт в домах наших клиентов уже более 14 лет. 
            Наша миссия — делать качественную мебель доступной для каждого.
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="section story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <h2 class="section-title">Наша история</h2>
            <p>
              Компания «САВ Мебель» была основана в 2010 году в городе Москва. 
              Начиналось всё с небольшой мастерской, где создавались первые образцы 
              корпусной мебели по индивидуальным заказам.
            </p>
            <p>
              За годы работы мы выросли в крупное производственное предприятие с 
              современным оборудованием и командой из более чем 150 специалистов. 
              Сегодня мы производим и поставляем мебель в 85 городов России.
            </p>
            <p>
              Мы гордимся тем, что за годы работы завоевали доверие десятков тысяч 
              клиентов и продолжаем развиваться, внедряя новые технологии и улучшая 
              качество нашей продукции.
            </p>
          </div>
          <div class="story-image">
            <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600" alt="Производство САВ Мебель" />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section values-section">
      <div class="container">
        <h2 class="section-title text-center">Наши ценности</h2>
        <div class="values-grid">
          <div class="value-card">
            <img :src="iconQuality" alt="Качество" class="value-icon" />
            <h3>Качество</h3>
            <p>
              Мы используем только проверенные материалы и современное оборудование. 
              Каждый этап производства проходит строгий контроль качества.
            </p>
          </div>
          <div class="value-card">
            <img :src="iconReliability" alt="Надежность" class="value-icon" />
            <h3>Надежность</h3>
            <p>
              Мы выполняем свои обязательства перед клиентами. Сроки, качество, 
              гарантия — всё, что мы обещаем, мы выполняем.
            </p>
          </div>
          <div class="value-card">
            <img :src="iconInnovation" alt="Инновации" class="value-icon" />
            <h3>Инновации</h3>
            <p>
              Мы постоянно развиваемся, внедряем новые технологии и следим за 
              современными тенденциями в мире мебели и дизайна.
            </p>
          </div>
          <div class="value-card">
            <img :src="iconEco" alt="Экологичность" class="value-icon" />
            <h3>Экологичность</h3>
            <p>
              Мы заботимся об окружающей среде и используем только безопасные, 
              сертифицированные материалы, не наносящие вреда здоровью.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section team-section">
      <div class="container">
        <h2 class="section-title text-center">Наша команда</h2>
        <p class="section-subtitle">
          Команда профессионалов, которые делают вашу мебель
        </p>
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card">
            <div class="team-image">
              <img :src="member.image" :alt="member.name" />
            </div>
            <div class="team-info">
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы создать уют в вашем доме?</h2>
          <p>Посмотрите наш каталог и выберите мебель вашей мечты</p>
          <div class="cta-buttons">
            <router-link to="/catalog" class="btn btn-primary btn-lg">
              Перейти в каталог
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  padding-top: 0;
}

.about-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  padding: 6rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-text {
  font-size: 1.25rem;
  line-height: 1.8;
  opacity: 0.95;
}

.section {
  padding: 5rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.section-subtitle {
  text-align: center;
  color: var(--text-light);
  font-size: 1.125rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.text-center {
  text-align: center;
}

/* Story Section */
.story-section {
  background: var(--white);
}

.story-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.story-content p {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.story-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: var(--radius);
  box-shadow: var(--shadow-hover);
}

/* Stats Section */
.stats-section {
  background: var(--primary-color);
  padding: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
}

.stat-item {
  padding: 2rem;
}

.stat-value {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Values Section */
.values-section {
  background: var(--bg-color);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  background: var(--white);
  padding: 2.5rem 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.value-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
}

.value-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.value-card p {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-light);
}

/* Team Section */
.team-section {
  background: var(--white);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.team-card {
  text-align: center;
}

.team-image {
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-info h3 {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: var(--primary-color);
}

.team-info p {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 5rem 0;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  color: var(--white);
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-buttons .btn-secondary {
  background: var(--white);
  color: var(--primary-color);
  border: none;
}

@media (max-width: 1024px) {
  .stats-grid,
  .values-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-hero {
    padding: 4rem 0;
  }

  .hero-text {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .story-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .story-image img {
    height: 300px;
  }

  .stats-grid,
  .values-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .cta-content h2 {
    font-size: 1.75rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>