import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import './style.css'

// Импорт локалей
import ru from './locales/ru.json';
import en from './locales/en.json';

// Явно задаем типы сообщений
const messages = {
    en,
    ru,
};

// Настройка i18n
const i18n = createI18n({
    locale: 'ru', // Локаль по умолчанию
    fallbackLocale: 'en', // Запасная локаль
    messages, // Передаем объект сообщений
});

const app = createApp(App);
app.use(i18n); // Применяем i18n
app.mount('#app');
