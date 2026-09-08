<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import CurrentWeatherInfo from "@components/CurrentWeatherInfo.vue";
import WeatherControlPanel from "@components/WeatherControlPanel.vue";

import ModalWindow from "@components/ModalWindow.vue";
import Button from "@components/Button.vue";

import { localeDateTransform } from "@/lib/dateHelper.js";
import { setLocalStorage, getLocalStorage } from "@/lib/localeStorageUtils";
import { cityProvide } from "@/lib/constants";

const API_ENDPOINT = "https://api.weatherapi.com/v1";
const CITY_STORAGE_KEY = "userCity";

let data = ref();
let error = ref();
let activeIndex = ref(null);
let detectedCity = ref();
let isModalVisible = ref(false);

// Context
let city = ref(getLocalStorage(CITY_STORAGE_KEY) || "Алмалык");
provide(cityProvide, city);

// Watching city
watch(city, (newCity) => {
  getCity(newCity);
  setLocalStorage(CITY_STORAGE_KEY, newCity);
});

// Initial query
onMounted(() => {
  getCity(city.value);
});

// Detect user location
onMounted(async () => {
  if (!getLocalStorage(CITY_STORAGE_KEY)) await detectLocationByIP();
});

console.log(detectedCity.value);

// Get forecast data
const forecastDays = computed(() => {
  if (!data.value?.forecast?.forecastday) return [];

  return data.value.forecast.forecastday.map((dayItem) => ({
    id: dayItem.date_epoch,
    temp: dayItem.day.avgtemp_c,
    date: new Date(dayItem.date),
    icon: dayItem.day.condition.icon,
    text: dayItem.day.condition.text,
    weatherCode: dayItem.day.condition.code,
  }));
});

// Watching days data, and activate first (day) button by default
watch(
  forecastDays,
  (newDays) => {
    if (newDays.length > 0 && !activeIndex.value) {
      activeIndex.value = newDays[0].id;
    }
  },
  { immediate: true },
);

// Active day forecast data
const activeDayData = computed(() => {
  if (!activeIndex.value || !forecastDays.value.length) return null;

  const activeDay = forecastDays.value.find(
    (day) => day.id === activeIndex.value,
  );
  if (!activeDay) return null;

  return {
    datetime: activeDay.date.toISOString(),
    currentDay: localeDateTransform(activeDay.date, "long"),
    currentDate: localeDateTransform(activeDay.date, {
      day: "numeric",
      month: "long",
    }),
    weatherIcon: activeDay.icon,
    currentTemp: `${Math.round(activeDay.temp)} °C`,
    currentText: activeDay.text,
    location: data.value?.location?.name,
  };
});

// Get city name from ip
async function detectLocationByIP() {
  const endpoints = [
    "https://ipapi.co/json/",
    "https://ipwho.is",
    "https://freeipapi.com/api/json/",
  ];

  for (const urlString of endpoints) {
    try {
      const response = await fetch(urlString);

      if (!response.ok) continue;

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn(
          `Сервис ${urlString} вернул не JSON. Пробуем следующий...`,
        );
        continue;
      }

      const result = await response.json();

      if (result.error || result.success === false) continue;

      const cityName = result.city;
      if (!cityName) continue;

      error.value = null;
      detectedCity.value = cityName;
      isModalVisible.value = true;

      console.log(`Успешно определено через ${urlString}:`, cityName);

      return;
    } catch (err) {
      console.error(`Ошибка запроса к ${urlString}:`, err.message);
    }
  }

  error.value = {
    message: "Не удалось определить город ни через один сервис.",
  };
  detectedCity.value = null;
}

const modalMsg = computed(() => `Вы находитесь в ${detectedCity.value}?`);

function confirmDetectedCity() {
  if (detectedCity.value) city.value = detectedCity.value;
  isModalVisible.value = false;
}

function declineDetectedCity() {
  isModalVisible.value = false;
}

async function getCity(city) {
  const url = new URL(`${API_ENDPOINT}/forecast.json`);
  url.search = new URLSearchParams({
    q: city,
    lang: "ru",
    key: "dba7b13593c6459881571045260309",
    days: 4,
  });

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      error.value = result;
      data.value = null;
      return;
    }

    error.value = null;
    data.value = result;
    console.log(data.value);
  } catch (err) {
    console.error("Ошибка при загрузке погоды:", err);

    error.value = {
      message: err.message || "Не удалось установить соединение с сервером.",
    };
    data.value = null;
  }
}
</script>

<template>
  <main class="container">
    <ModalWindow
      v-if="isModalVisible"
      :visible="isModalVisible"
      :messages="modalMsg"
    >
      <div class="wrapper">
        <Button @click="confirmDetectedCity">Да</Button>
        <Button @click="declineDetectedCity">Нет</Button>
      </div>
    </ModalWindow>

    <CurrentWeatherInfo
      v-if="activeIndex"
      v-bind="activeDayData"
      class="left-box"
    />

    <WeatherControlPanel
      :data
      :error
      :active-index="activeIndex"
      :forecast-days="forecastDays"
      @select-index="(index) => (activeIndex = index)"
      @select-city="getCity"
    />
  </main>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.container {
  width: 100%;

  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-wrap: wrap;

  position: relative;

  padding: var(--space-size-l) 0;
  gap: var(--space-size-l);

  @media (min-width: rem(1200)) {
    max-width: rem(944);
    min-height: 100dvh;

    flex-wrap: nowrap;
    place-items: center;

    padding: 0;
  }
}

.wrapper {
  display: flex;
  flex-wrap: wrap;

  justify-content: center;

  gap: rem(8);
}

.left-box {
  @media (min-width: rem(1200)) {
    position: absolute;
    left: rem(-55);
    z-index: 4;
  }
}
</style>
