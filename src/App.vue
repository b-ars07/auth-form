<template>
  <div class="page-container">
    <!-- Контейнер формы авторизации -->
    <div class="form-container">
      <img src="./assets/logo.png" alt="Логотип" class="logo" />
      <h1>{{ $t('auth.title') }}</h1>
      <p class="subtitle">{{ $t('auth.subtitle') }}</p>

      <!-- Компонент выбора страны -->
      <CountrySelect v-model="selectedCountry" />

      <!-- Компонент ввода номера телефона -->
      <PhoneInput :countryCode="selectedCountry ? selectedCountry.dial_code : ''" v-model="phone" />

      <!-- Кнопка отправки -->
      <button @click="submitForm" class="btn-submit">{{ $t('auth.submit') }}</button>

      <!-- Селектор для выбора языка -->
      <div class="footer">
        <select v-model="locale" @change="changeLocale" class="locale-select">
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CountrySelect from '@/components/CountrySelect.vue';
import PhoneInput from '@/components/PhoneInput.vue';

// I18n hook для локализации
const { t, locale } = useI18n();

// Состояния
const phone = ref<string>('');
const selectedCountry = ref<{ name: string; dial_code: string; flag: string; code: string } | null>(null);

// Смена локали
const changeLocale = (e: Event) => {
  const newLocale = (e.target as HTMLSelectElement).value;
  if (newLocale === 'en' || newLocale === 'ru') {
    locale.value = newLocale;
  }
};

// Обработка отправки формы
const submitForm = () => {
  console.log('Phone:', phone.value);
};
</script>


<style scoped>
/* Центрирование всей страницы */
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

/* Основная структура формы */
.form-container {
  max-width: 360px;
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

/* Стили для кнопки отправки */
.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.btn-submit:hover {
  background-color: #0056b3;
}

/* Нижняя часть с переключением языков */
.footer {
  margin-top: 20px;
}

.locale-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}
</style>
