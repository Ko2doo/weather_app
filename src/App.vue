<script setup>
import { ref } from "vue";

import Stat from "@components/Stat.vue";
import CitySelect from "@components/CitySelect.vue";

const API_ENDPOINT = "https://api.weatherapi.com/v1";

const myStats = [
  { label: "Влажность", stat: "90%" },
  { label: "Осадки", stat: "0%" },
];

let savedCity = ref("Kiev");

async function getCity(city) {
  // savedCity.value = city;
  const params = new URLSearchParams({
    q: city,
    lang: "ru",
    key: "dba7b13593c6459881571045260309",
    days: 3,
  });

  const response = await fetch(
    `${API_ENDPOINT}/forecast.json?${params.toString()}`,
  );
  const data = await response.json();

  console.log(data);
}
</script>

<template>
  <main class="container">
    <section class="weather-box">
      <Stat :stats="myStats" />
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

.weather-box {
  width: 100%;

  flex-basis: 100%;
  display: flex;
  flex-direction: column;

  padding: rem(55) rem(50);
  margin: 0 rem(20);

  background-color: var(--secondary-color);
  border-radius: var(--border-radius-l);

  @media (min-width: rem(1200)) {
    margin: 0;
  }
}
</style>
