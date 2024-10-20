<template>
  <div class="dropdown-container" v-if="isOpen">
    <!-- Поле поиска, если включено -->
    <div v-if="enableSearch" class="search-container">
      <input
          ref="searchInput"
          type="text"
          v-model="search"
          placeholder="Поиск"
          class="search-input"
      />
    </div>

    <!-- Список опций, который можно прокручивать -->
    <ul class="option-list">
      <li
          v-for="(option, index) in filteredOptions"
          :key="option.index"
          @click="selectOption(option)"
          class="option-item"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Country } from '@/types/countryTypes.ts';

const props = defineProps<{
  options: Country[]; // Объявляем тип, что это массив объектов
  isOpen: boolean;
  enableSearch?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', value: Country): void;
}>();

// Состояние для поиска
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

// Фильтрация опций на основе поиска с проверкой на наличие данных
const filteredOptions = computed(() => {
  return props.options.filter((option) =>
      option.label.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Следим за открытием выпадающего списка и устанавливаем фокус на строку поиска
watch(
    () => props.isOpen,
    async (isOpen) => {
      if (isOpen && props.enableSearch) {
        await nextTick();
        search.value = ''; // Очищаем строку поиска при открытии
        if (searchInput.value) {
          searchInput.value.focus();
        }
      }
    }
);

// Функция для выбора опции
const selectOption = (option: { value: string; label: string; name: string; index: number }) => {
  emit('select', option);
  search.value = ''; // Очищаем строку поиска после выбора
};
</script>

<style scoped>
.dropdown-container {
  position: absolute;
  width: 100%;
  max-width: 360px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 10;
  margin-top: 5px;
}

.search-container {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.option-list {
  max-height: 200px; /* Задаем высоту для прокрутки списка */
  overflow-y: auto; /* Скролл по вертикали */
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.option-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.option-item:hover {
  background-color: #f5f5f5;
}
</style>
