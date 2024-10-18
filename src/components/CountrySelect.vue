<template>
  <div class="country-container">
    <!-- Селектор страны -->
    <div class="country-select" @click="toggleDropdown">
      <label for="country">{{ selectedCountry ? selectedCountry.name : $t('auth.country') }}</label>
      <span class="dropdown-arrow">▼</span>
    </div>

    <!-- Выпадающий список с поиском и странами -->
    <div v-if="dropdownOpen" class="dropdown">
      <!-- Строка поиска появляется только при открытии списка -->
      <input
          type="text"
          v-model="search"
          placeholder="Поиск"
          class="search-input"
      />
      <ul class="country-list">
        <li
            v-for="country in filteredCountries"
            :key="country.code"
            @click="selectCountry(country)"
            class="country-item"
        >
          {{ country.flag }} {{ country.name }} ({{ country.dial_code }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; // Убираем toRaw
import { Country } from '../types/countryTypes';

// Состояние поиска и выпадающего списка
const search = ref<string>('');
const dropdownOpen = ref<boolean>(false);

// Состояние для хранения списка стран
const countries = ref<Country[]>([]);
const selectedCountry = ref<Country | null>(null);

// Загрузка списка стран из API
onMounted(async () => {
  try {
    const response = await fetch(
        'https://gist.githubusercontent.com/DmytroLisitsyn/1c31186e5b66f1d6c52da6b5c70b12ad/raw/2bc71083a77106afec2ec37cf49d05ee54be1a22/country_dial_info.json'
    );
    countries.value = await response.json();

    // Установка страны по умолчанию
    selectedCountry.value = countries.value.find(country => country.code === 'RU') || null;
  } catch (error) {
    console.error('Ошибка при загрузке стран:', error);
  }
});

// Фильтр списка стран на основе поиска
const filteredCountries = computed(() =>
    countries.value.filter(country =>
        country.name.toLowerCase().includes(search.value.toLowerCase())
    )
);

// Переключение состояния выпадающего списка
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Выбор страны
const selectCountry = (country: Country) => {
  console.log(country)
  selectedCountry.value = country;
  dropdownOpen.value = false; // Закрытие списка после выбора
};
</script>

<style scoped>
/* Контейнер для селектора страны */
.country-container {
  position: relative;
  width: 100%;
}

/* Основной селектор страны */
.country-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.selected-country {
  font-size: 14px;
}

/* Стрелка для dropdown */
.dropdown-arrow {
  font-size: 14px;
}

/* Выпадающий список */
.dropdown {
  position: absolute;
  width: 100%;
  max-width: 360px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 10;
  margin-top: 8px;
}

/* Поле поиска */
.search-input {
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}

/* Список стран */
.country-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.country-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.country-item:hover {
  background-color: #f5f5f5;
}
</style>
