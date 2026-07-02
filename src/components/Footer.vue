<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function subscribe() {
  if (email.value.trim()) {
    alert('Спасибо за подписку! Мы будем присылать вам новости и специальные предложения.')
    email.value = ''
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-section">
          <h3 class="footer-title">САВ Мебель</h3>
          <p class="footer-text">
            Качественная мебель для вашего дома с 2010 года. 
            Мы создаем уют и комфорт в каждом доме.
          </p>
          <div class="footer-social">
            <a href="https://vk.com/aaaaaaaaaaaaaaaa_aa_a" target="_blank" rel="noopener noreferrer" class="social-link" title="ВКонтакте">VK</a>
            <a href="https://t.me/FouRkfildor" target="_blank" rel="noopener noreferrer" class="social-link" title="Telegram">TG</a>
            <a href="https://wa.me/79157635150" target="_blank" rel="noopener noreferrer" class="social-link" title="WhatsApp">WA</a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Каталог</h3>
          <ul class="footer-links">
            <li><router-link to="/catalog/sofas">Диваны</router-link></li>
            <li><router-link to="/catalog/beds">Кровати</router-link></li>
            <li><router-link to="/catalog/tables">Столы</router-link></li>
            <li><router-link to="/catalog/chairs">Стулья</router-link></li>
            <li><router-link to="/catalog/wardrobes">Шкафы</router-link></li>
            <li><router-link to="/catalog/kitchens">Кухни</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Покупателям</h3>
          <ul class="footer-links">
            <li><router-link to="/customers?tab=delivery">Доставка и оплата</router-link></li>
            <li><router-link to="/customers?tab=warranty">Гарантия</router-link></li>
            <li><router-link to="/customers?tab=returns">Возврат</router-link></li>
            <li><router-link to="/customers?tab=reviews">Отзывы</router-link></li>
            <li><router-link to="/customers?tab=faq">Вопрос-ответ</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Контакты</h3>
          <ul class="footer-contact">
            <li>📍 г. Москва, ул. Примерная, д. 123</li>
            <li>📞 +7 (999) 123-45-67</li>
            <li>✉️ info@sav-mebel.ru</li>
            <li>🕐 Пн-Вс: 9:00 - 21:00</li>
          </ul>
        </div>
      </div>

      <div class="footer-newsletter">
        <div class="newsletter-content">
          <h3 class="newsletter-title">Подпишитесь на новости</h3>
          <p class="newsletter-text">Получайте информацию о новинках и специальных предложениях</p>
        </div>
        <form @submit.prevent="subscribe" class="newsletter-form">
          <input v-model="email" type="email" placeholder="Введите ваш email" required />
          <button type="submit" class="btn btn-primary">Подписаться</button>
        </form>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2024 САВ Мебель. Все права защищены.</p>
        <div class="footer-bottom-links">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Публичная оферта</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--primary-color);
  color: var(--white);
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-text {
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  transition: var(--transition);
}

.social-link:hover {
  background: var(--secondary-color);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--white);
  padding-left: 0.5rem;
}

.footer-contact {
  list-style: none;
  font-size: 0.875rem;
}

.footer-contact li {
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.footer-newsletter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
}

.newsletter-title {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.newsletter-text {
  font-size: 0.875rem;
  opacity: 0.8;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
}

.newsletter-form input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--white);
  border-radius: var(--radius);
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.newsletter-form input:focus {
  border-color: var(--secondary-color);
  background: rgba(255, 255, 255, 0.15);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  font-size: 0.875rem;
}

.copyright {
  opacity: 0.6;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.footer-bottom-links a:hover {
  color: var(--white);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-newsletter {
    flex-direction: column;
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
    width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>