<template>
  <div class="language-switcher-container">
    <div class="language-select" @click="toggleDropdown">
      {{ selectedLanguage ? selectedLanguage.label : 'Выбрать язык' }}
      <span class="dropdown-arrow">▼</span>
    </div>
    <div class="dropdown-container" v-if="dropdownOpen">
      <ul class="language-list">
        <li
            v-for="(language, index) in languageOptions"
            :key="index"
            @click="selectLanguage(language)"
            class="language-item"
        >
          {{ language.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LanguageOption } from '@/types/commonTypes'; // Импортируем интерфейс

// Используем useI18n для управления локалью
const { locale } = useI18n();

const dropdownOpen = ref(false);
const selectedLanguage = ref<LanguageOption | null>(null);

// Опции выбора языка
const languageOptions: LanguageOption[] = [
  { value: 'en', label: 'English', name: 'English', index: 0 },
  { value: 'ru', label: 'Русский', name: 'Русский', index: 1 },
];

// Переключение состояния дропдауна
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Обработка выбора языка
const selectLanguage = (selected: LanguageOption) => {
  selectedLanguage.value = selected;
  dropdownOpen.value = false;

  // Обновляем текущую локаль в системе i18n
  locale.value = selected.value as typeof locale.value;
};
</script>

<style scoped>
.language-switcher-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
  position: relative;
  width: fit-content;
}

.language-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  background-color: transparent;
  transition: border-color 0.3s, background-color 0.3s;
}

.language-select:hover {
  border-color: #ccc;
  background-color: #f0f0f0;
}

.dropdown-arrow {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}

.dropdown-container {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  width: 100%;
  z-index: 10;
}

.language-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.language-item {
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.language-item:hover {
  background-color: #f0f0f0;
}
</style>
