<script setup>
import { computed, ref, watch } from "vue";

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

// Stats day data
const dataStats = computed(() => {
  if (!data.value?.forecast?.forecastday) return [];

  const rawActiveDay =
    data.value.forecast.forecastday.find(
      (dayItem) => dayItem.date_epoch === activeIndex.value,
    ) || data.value.forecast.forecastday[0];

  if (!rawActiveDay) return [];

  return [
    { label: "Влажность", stat: `${rawActiveDay.day.avghumidity} %` },
    { label: "УФ-индекс", stat: rawActiveDay.day.uv },
    { label: "Ветер", stat: `${rawActiveDay.day.maxwind_kph} км/ч` },
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

// Watching days data, and activate first (day) button in default
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
    <CurrentWeatherInfo
      v-if="activeIndex"
      v-bind="activeDayData"
      class="left-box"
    />

    <section class="weather-box">
      <div class="inner-wrapper">
        <Error :error="errorDisplay" />

        <Stat :stats="dataStats" />

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
            class="card-width"
            @click="() => (activeIndex = day.id)"
          />
        </div>

        <CitySelect @select-city="getCity" />
      </div>
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
    position: relative;
  }
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
}

.left-box {
  @media (min-width: rem(1200)) {
    position: absolute;
    left: rem(-55);
    z-index: 4;
  }
}

.card-width {
  width: 100%;

  @media (min-width: rem(420)) {
    width: calc(100% / 2);
  }

  @media (min-width: rem(620)) {
    width: calc((100% / 4) - rem(2));

    &:not(:first-child) {
      margin-left: rem(2);
    }
  }
}

.weather-box {
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: rem(55) rem(50);
  margin: 0 var(--space-size-l);

  overflow: hidden;

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);

  @media (min-width: rem(1200)) {
    margin: 0;
    align-items: flex-end;
  }
}

.inner-wrapper {
  display: flex;
  flex-direction: column;

  gap: rem(74);

  @media (min-width: rem(1200)) {
    width: rem(415);
  }
}
</style>
