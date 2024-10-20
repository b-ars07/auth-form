<template>
  <div>
    <!-- Выпадающий селектор страны -->
    <div class="country-select" @click="toggleDropdown">
      <label for="country">{{ selectedCountry ? selectedCountry.label : $t('auth.country') }}</label>
      <span class="dropdown-arrow">▼</span>
    </div>

    <!-- Компонент BaseSelect для выбора страны -->
    <BaseSelect
        :options="countryOptions"
        :isOpen="dropdownOpen"
        enableSearch
        @select="selectCountry"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseSelect from '@/components/BaseSelect.vue';

// Определение пропсов и событий
const props = defineProps<{
  modelValue: { dial_code: string; label: string; name: string; index: number } | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { dial_code: string; label: string; name: string; index: number } | null): void;
}>();

// Состояния
const dropdownOpen = ref(false);
const selectedCountry = ref(props.modelValue);
const countryOptions = ref<{ dial_code: string; label: string; name: string; index: number }[]>([]);

// Загрузка списка стран и установка страны по умолчанию
onMounted(async () => {
  try {
    const response = await fetch(
        'https://gist.githubusercontent.com/DmytroLisitsyn/1c31186e5b66f1d6c52da6b5c70b12ad/raw/2bc71083a77106afec2ec37cf49d05ee54be1a22/country_dial_info.json'
    );
    const countries = await response.json();
    countryOptions.value = countries.map((country: any, index: number) => ({
      dial_code: country.dial_code,
      label: `${country.flag} ${country.name} (${country.dial_code})`,
      name: country.name,
      index,
    }));

    // Устанавливаем страну по умолчанию — Россия
    if (!selectedCountry.value) {
      selectedCountry.value = countryOptions.value.find((country) => country.name === 'Russia') || countryOptions.value[0];
      emit('update:modelValue', selectedCountry.value);
    }
  } catch (error) {
    console.error('Ошибка при загрузке списка стран:', error);
  }
});

// Открытие и закрытие выпадающего списка
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Функция для выбора страны
const selectCountry = (country: { dial_code: string; label: string; name: string; index: number }) => {
  selectedCountry.value = country;
  dropdownOpen.value = false;
  emit('update:modelValue', country); // Эмитируем событие для обновления модели в родительском компоненте
};
</script>

<style scoped>
.country-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
}

.dropdown-arrow {
  margin-left: 10px;
}
</style>
