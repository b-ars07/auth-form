<template>
  <div class="phone-input-container">
    <input
        type="tel"
        v-model="phoneNumber"
        :placeholder="`Введите номер телефона${countryCode ? ' (' + countryCode + ')' : ''}`"
        class="input-phone"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from 'vue';

const props = defineProps<{
  countryCode: string;
  modelValue: string;
}>();

const phoneNumber = ref(props.modelValue);

// Emit событие для синхронизации с родительским компонентом
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

watch(phoneNumber, (newValue) => {
  emit('update:modelValue', newValue);
});

// Обновляем номер телефона при изменении кода страны
watch(
    () => props.countryCode,
    (newCode) => {
      if (newCode && !phoneNumber.value.startsWith(newCode)) {
        phoneNumber.value = `${newCode} `;
      }
    }
);
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
}

.input-phone::placeholder {
  color: #ccc;
}
</style>
