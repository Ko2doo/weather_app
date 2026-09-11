<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import CurrentWeatherInfo from "@components/CurrentWeatherInfo.vue";
import WeatherControlPanel from "@components/WeatherControlPanel.vue";
import WeatherHourly from "@components/WeatherHourly.vue";
import Footer from "@components/Footer.vue";

import ModalWindow from "@components/ModalWindow.vue";
import Button from "@components/Button.vue";

import { localeDateTransform } from "@/lib/dateHelper.js";
import { setLocalStorage, getLocalStorage } from "@/lib/localeStorageUtils";
import { sanitizeCityName } from "@/lib/sanitizeCityName";
import { cityProvide } from "@/lib/constants";

const API_ENDPOINT = "/api";
const CITY_STORAGE_KEY = "userCity";

let data = ref();
let error = ref();
let activeIndex = ref(null);
let detectedCity = ref();
let isModalVisible = ref(false);

// Locales
let locale = ref("ru");

// Context
let city = ref(getLocalStorage(CITY_STORAGE_KEY) || "Алмалык");
provide(cityProvide, city);

// Watching city
watch(city, (newCity) => {
  getCity(newCity, locale.value);
  setLocalStorage(CITY_STORAGE_KEY, newCity);
});

// Locale watching
watch(locale, () => {
  if (city.value) getCity(city.value, locale.value);
});

// Initial query
onMounted(() => {
  getCity(city.value);
});

// Detect user location
onMounted(async () => {
  if (!getLocalStorage(CITY_STORAGE_KEY)) await detectLocationByIP();
});

// Get forecast data
const forecastDays = computed(() => {
  if (!data.value?.forecast?.forecastday) return [];
  console.log(data.value);

  return data.value.forecast.forecastday.map((dayItem) => ({
    id: dayItem.date_epoch,
    temp: dayItem.day.avgtemp_c,
    date: new Date(dayItem.date),
    icon: dayItem.day.condition.icon,
    text: dayItem.day.condition.text,
    weatherCode: dayItem.day.condition.code,
    hourly: dayItem.hour,
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
    location: {
      country: data.value?.location?.country,
      region: data.value?.location?.region,
      name: data.value?.location?.name,
    },
  };
});

const activeDayHourly = computed(() => {
  if (!activeIndex.value || !forecastDays.value.length) return null;

  const activeDay = forecastDays.value.find(
    (day) => day.id === activeIndex.value,
  );

  return activeDay?.hourly ?? [];
});

// Get city name from ip
async function detectLocationByIP() {
  try {
    const response = await fetch("/api/ip-lookup");

    if (!response.ok) {
      throw new Error("Сервис определения города недоступен");
    }

    const result = await response.json();
    const cityName = result.city ? sanitizeCityName(result.city) : null;

    if (!cityName) {
      throw new Error("Не удалось определить город по IP");
    }

    error.value = null;
    detectedCity.value = cityName;
    isModalVisible.value = true;
  } catch (err) {
    console.error("Ошибка определения местоположения:", err.message);
    error.value = {
      message: "Не удалось определить город по IP.",
    };
    detectedCity.value = null;
  }
}

const modalMsg = computed(() => `Вы находитесь в ${detectedCity.value}?`);

function confirmDetectedCity() {
  if (detectedCity.value) city.value = detectedCity.value;
  isModalVisible.value = false;
}

function declineDetectedCity() {
  isModalVisible.value = false;
}

async function getCity(city, lang = locale.value) {
  const url = new URL(`${API_ENDPOINT}/forecast`, window.location.origin);
  url.searchParams.set("city", city);
  url.searchParams.set("lang", lang);
  url.searchParams.set("days", "3");

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
    // console.log(data.value);
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

    <template v-if="data && !isModalVisible">
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

      <WeatherHourly v-if="activeIndex" :hourly="activeDayHourly" />
    </template>
  </main>

  <Footer />
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
  flex: 1 0 auto;

  position: relative;

  padding: var(--space-size-l) 0;
  gap: var(--space-size-l);

  @media (min-width: rem(1200)) {
    max-width: rem(980);

    margin-top: var(--space-size-l);
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
    top: 0;
    z-index: 4;
  }
}
</style>
