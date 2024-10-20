<template>
  <div class="page-container">
    <!-- Контейнер формы авторизации -->
    <div class="form-container">
      <img src="./assets/logo.png" alt="Логотип" class="logo" />

      <!-- Форма ввода номера телефона -->
      <div v-if="!sessionId">
        <h1>{{ $t('auth.title') }}</h1>
        <p class="subtitle">{{ $t('auth.subtitle') }}</p>

        <!-- Компонент выбора страны -->
        <CountrySelect v-model="selectedCountry" />

        <!-- Компонент ввода номера телефона -->
        <PhoneInput :countryCode="selectedCountry ? selectedCountry.dial_code : ''" v-model="phone" />

        <!-- Кнопка отправки -->
        <button @click="createAuthorizationSession" class="btn-submit">{{ $t('auth.submit') }}</button>
      </div>

      <!-- Форма проверки кода -->
      <div v-else>
        <h1>{{ $t('auth.enter_code') }}</h1>
        <p class="subtitle">{{ $t('auth.code_sent', { phone: formattedPhone }) }}</p>

        <!-- Выбор канала отправки кода -->
        <div class="channel-select-container">
          <label class="channel-label">{{ $t('auth.channel') }}</label>
          <!-- Выпадающий список для выбора канала отправки кода -->
          <BaseSelect
              :options="channels"
              :isOpen="dropdownOpen"
              enableSearch
              v-model="selectedChannel"
              @select="selectChannel"
          />
        </div>

        <!-- Поле ввода кода и кнопка отправки -->
        <div class="code-input-container">
          <input type="text" v-model="verificationCode" placeholder="Введите код" class="code-input" />
          <button @click="sendVerificationCode" class="send-code-btn">{{ $t('auth.send_code') }}</button>
        </div>

        <!-- Кнопка для проверки введенного кода -->
        <button @click="checkVerificationCode" class="btn-submit">{{ $t('auth.submit') }}</button>

        <!-- Кнопка для возвращения на предыдущий шаг -->
        <button @click="resetAuthorizationSession" class="btn-back">{{ $t('auth.back') }}</button>
      </div>

      <!-- Ссылки на условия и конфиденциальность -->
      <div class="links-container">
        <a href="#" class="link">{{ $t('auth.terms') }}</a>
        <a href="#" class="link">{{ $t('auth.privacy') }}</a>
      </div>

      <!-- Селектор для выбора языка -->
      <div class="footer">
        <LanguageSwitcher />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CountrySelect from '@/components/CountrySelect.vue';
import PhoneInput from '@/components/PhoneInput.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import { createSession, sendCode, checkCode } from '@/services/kodMobiService';

// I18n hook для локализации
const { t } = useI18n();

// Состояния
const phone = ref<string>('');
const selectedCountry = ref<{ name: string; dial_code: string; flag: string; code: string } | null>(null);
const sessionId = ref<string | null>(null);
const channels = ref<{ value: string; label: string }[]>([
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'viber', label: 'Viber' },
  { value: 'sms', label: 'SMS' }
]);
const verificationCode = ref<string>('');
const selectedChannel = ref<string>('whatsapp'); // Значение по умолчанию — WhatsApp
const dropdownOpen = ref<boolean>(true); // Открываем dropdown по умолчанию

// Создание сессии для отправки кода
const createAuthorizationSession = async () => {
  if (!phone.value) {
    alert(t('auth.enter_phone'));
    return;
  }

  try {
    const response = await createSession(phone.value.replace(/\D/g, ''));
    sessionId.value = response.session_id;
    console.log('Сессия создана:', sessionId.value);
  } catch (error) {
    console.error('Ошибка при создании сессии:', error);
  }
};

// Сброс сессии и возвращение на первый шаг
const resetAuthorizationSession = () => {
  sessionId.value = null;
  verificationCode.value = '';
  selectedChannel.value = 'whatsapp'; // Сбрасываем на значение по умолчанию
};

// Выбор канала для отправки кода
const selectChannel = (channel: { value: string; label: string }) => {
  selectedChannel.value = channel.value;
  dropdownOpen.value = false; // Закрываем селектор после выбора канала
  console.log('Канал выбран:', selectedChannel.value);
};

// Отправка кода через выбранный канал
const sendVerificationCode = async () => {
  if (!sessionId.value) {
    console.error('Нет активной сессии');
    return;
  }

  try {
    await sendCode(sessionId.value, selectedChannel.value);
    console.log('Код отправлен через канал:', selectedChannel.value);
  } catch (error) {
    console.error('Ошибка при отправке кода:', error);
  }
};

// Проверка кода
const checkVerificationCode = async () => {
  if (!sessionId.value || !verificationCode.value) {
    alert(t('auth.enter_verification_code'));
    return;
  }

  try {
    const response = await checkCode(sessionId.value, verificationCode.value);
    console.log('Токен проверки:', response.verify_token);
    alert(t('auth.verification_successful'));
  } catch (error) {
    console.error('Ошибка при проверке кода:', error);
    alert(t('auth.verification_failed'));
  }
};

const formattedPhone = computed(() => {
  return phone.value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
});
</script>

<style scoped>
/* Стили для формы и элементов */
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

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
  max-width: 300px;
  height: 40px;
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

.btn-back {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
  background-color: #ddd;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.btn-back:hover {
  background-color: #bbb;
}

.links-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.link {
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: start;
}

.channel-select-container {
  margin-bottom: 20px;
  text-align: left;
}

.channel-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.code-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.code-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.send-code-btn {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.send-code-btn:hover {
  background-color: #0056b3;
}
</style>
