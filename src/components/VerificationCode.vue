<template>
  <div class="verification-container">
    <p>Отправлен по номеру {{ phone }}</p>
    <select v-model="selectedChannel" @change="changeChannel">
      <option v-for="channel in availableChannels" :key="channel.type" :value="channel.type">
        {{ channel.name }}
      </option>
    </select>
    <input v-model="code" placeholder="Введите код" />
    <button @click="checkAuthorizationCode">Продолжить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sendCode, checkCode } from '@/services/kodMobiService';

const phone = ref(''); // передать телефон из родительского компонента через props
const sessionId = ref<string | null>(null); // передать sessionId из родительского компонента через props
const availableChannels = ref<{ name: string; type: string; is_active: boolean; timeout: number }[]>([]);
const selectedChannel = ref<string>('whatsapp'); // по умолчанию выбираем канал
const code = ref('');

// Изменение канала и повторная отправка кода
const changeChannel = async () => {
  if (!sessionId.value) return;

  try {
    await sendCode(sessionId.value, selectedChannel.value);
  } catch (error) {
    console.error('Ошибка при повторной отправке кода:', error);
  }
};

// Проверка введенного кода
const checkAuthorizationCode = async () => {
  if (!sessionId.value || !code.value) {
    alert('Пожалуйста, введите код');
    return;
  }

  try {
    const verificationData = await checkCode(sessionId.value, code.value);
    console.log('Verify token:', verificationData.verify_token);
    alert('Код успешно проверен');
  } catch (error) {
    console.error('Ошибка при проверке кода:', error);
  }
};
</script>
