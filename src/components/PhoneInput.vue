<template>
  <div class="phone-input-container">
    <input
        ref="phoneInput"
        type="tel"
        v-model="phoneNumber"
        :placeholder="`Введите номер телефона${countryCode ? ' (' + countryCode + ')' : ''}`"
        class="input-phone"
        :class="{ 'input-error': !isPhoneValid && isDirty }"
        inputmode="numeric"
        pattern="[0-9+]*"
        @focus="setCursorPosition"
        @input="handleInput"
    />
    <div class="error-message-container">
      <span v-if="!isPhoneValid && isDirty" class="error-message">Неверный формат номера</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed, nextTick } from 'vue';

const props = defineProps<{
  countryCode: string;
  modelValue: string;
}>();

// Инициализация номера телефона с кодом страны
const phoneNumber = ref(`${props.countryCode} `);

// Обновление значения номера телефона при изменении `props.countryCode`
watch(
    () => props.countryCode,
    (newCode) => {
      if (newCode && !phoneNumber.value.startsWith(newCode)) {
        phoneNumber.value = `${newCode} `;
      }
    },
    { immediate: true }
);

// Ссылка на элемент поля ввода телефона
const phoneInput = ref<HTMLInputElement | null>(null);

// Флаг, который указывает, что пользователь начал вводить данные
const isDirty = ref(false);

// Emit событие для синхронизации с родительским компонентом
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Слежение за изменением значения phoneNumber
watch(phoneNumber, (newValue) => {
  emit('update:modelValue', newValue);
});

// Слежение за изменением кода страны
watch(
    () => props.countryCode,
    (newCode) => {
      if (newCode && !phoneNumber.value.startsWith(newCode)) {
        phoneNumber.value = `${newCode} `;
      }
    },
    { immediate: true }
);

// Функция для обработки ввода номера телефона
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  // Устанавливаем значение номера телефона, оставляя код страны в начале
  if (!target.value.startsWith(`${props.countryCode} `)) {
    phoneNumber.value = `${props.countryCode} ` + target.value.slice(props.countryCode.length + 1);
  } else {
    phoneNumber.value = target.value;
  }

  // Очищаем все недопустимые символы, за исключением кода страны и пробела
  phoneNumber.value = phoneNumber.value.replace(/(?!^\+)[^0-9\s]/g, '');

  // Устанавливаем флаг, что пользователь начал вводить
  if (!isDirty.value) {
    isDirty.value = true;
  }
};

// Устанавливаем курсор после кода страны при фокусе
const setCursorPosition = () => {
  if (phoneInput.value) {
    nextTick(() => {
      const inputElement = phoneInput.value as HTMLInputElement; // Явное приведение типа
      const position = phoneNumber.value.length;
      inputElement.setSelectionRange(position, position);
    });
  }
};

// Валидация номера телефона: проверяем, что длина части без кода страны равна 10 символам
const isPhoneValid = computed(() => {
  const numericPart = phoneNumber.value.replace(props.countryCode, '').replace(/\D/g, ''); // Убираем код страны и все символы, кроме цифр
  return numericPart.length === 10;
});
</script>

<style scoped>
/* Стили для поля ввода телефона */
.phone-input-container {
  margin-bottom: 20px;
}

.input-phone {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-phone::placeholder {
  color: #ccc;
}

.input-phone.input-error {
  border-color: red;
}

/* Контейнер для сообщения об ошибке */
.error-message-container {
  height: 20px; /* Зарезервированное пространство для сообщения об ошибке */
  margin-top: 5px;
}

.error-message {
  color: red;
  font-size: 12px;
  display: block;
}
</style>
