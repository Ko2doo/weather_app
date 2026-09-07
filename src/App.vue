<script setup>
import { computed, ref } from "vue";

import Stat from "@components/Stat.vue";
import DayCard from "@/components/DayCard.vue";
import CitySelect from "@components/CitySelect.vue";
import CurrentWeatherInfo from "@/components/CurrentWeatherInfo.vue";
import Error from "@/components/Error.vue";

import { localeDateTransform } from "@/lib/dateHelper.js";

const API_ENDPOINT = "https://api.weatherapi.com/v1";

const errorMap = new Map([[1006, "Указанный город не найден"]]);

let data = ref();
let error = ref();
let activeIndex = ref(null);

const errorDisplay = computed(() => {
  return errorMap.get(error?.value?.error?.code);
});

const dataModified = computed(() => {
  if (!data.value) return [];

  return [
    { label: "Влажность", stat: data.value.current.humidity + " %" },
    { label: "Облачность", stat: data.value.current.cloud + " %" },
    { label: "Ветер", stat: data.value.current.wind_kph + " км/ч" },
  ];
});

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
    <CurrentWeatherInfo v-if="activeIndex" v-bind="activeDayData" />

    <section class="weather-box">
      <Error :error="errorDisplay" />

      <Stat :stats="dataModified" />

      <div class="wrapper">
        <DayCard
          v-for="day in forecastDays"
          :key="day.id"
          :code="day.weatherCode"
          :icon="day.icon"
          :text="day.text"
          :temp="day.temp"
          :date="day.date"
          :is-active="activeIndex == day.id"
          @click="() => (activeIndex = day.id)"
        />
      </div>

      <CitySelect @select-city="getCity" />
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;
@use "@styles/tools/mixins" as *;

.container {
  width: 100%;
  min-height: 100dvh;

  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-wrap: wrap-reverse;
  place-items: center;

  padding: var(--space-size-l) 0;
  gap: var(--space-size-l);

  @media (min-width: rem(1200)) {
    max-width: rem(944);
    flex-wrap: nowrap;

    padding: 0;
  }
}

.wrapper {
  display: flex;
  flex-wrap: wrap;

  gap: rem(2);
}

.weather-box {
  width: 100%;

  flex-basis: 100%;
  display: flex;
  flex-direction: column;

  padding: rem(55) rem(50);
  margin: 0 var(--space-size-l);
  gap: rem(74);

  overflow: hidden;

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);

  @media (min-width: rem(1200)) {
    margin: 0;
  }
}
</style>
