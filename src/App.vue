<script setup>
import { computed, ref } from "vue";

import Stat from "@components/Stat.vue";
import DayCard from "./components/DayCard.vue";
import CitySelect from "@components/CitySelect.vue";
import Error from "@/components/Error.vue";

const API_ENDPOINT = "https://api.weatherapi.com/v1";

const errorMap = new Map([[1006, "Указанный город не найден"]]);

let data = ref();
let error = ref();

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
  place-items: center;

  @media (min-width: rem(1200)) {
    max-width: rem(944);
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
  margin: 0 rem(20);
  gap: rem(74);

  overflow: hidden;

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);

  @media (min-width: rem(1200)) {
    margin: 0;
  }
}
</style>
