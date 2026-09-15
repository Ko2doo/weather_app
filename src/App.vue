<script setup>
import { onMounted, provide, ref } from "vue";
import CurrentWeatherInfo from "@components/CurrentWeatherInfo.vue";
import WeatherControlPanel from "@components/WeatherControlPanel.vue";
import WeatherHourly from "@components/WeatherHourly.vue";
import Footer from "@components/Footer.vue";

import ModalWindow from "@components/ModalWindow.vue";
import Button from "@components/Button.vue";

import { getLocalStorage } from "@/lib/localeStorageUtils";
import { CITY_STORAGE_KEY, cityProvide } from "@/lib/constants";

import { useWeatherForecast } from "@/composables/useWeatherForecast";
import { useGeoIp } from "@/composables/useGeoIp";

// Locales
let locale = ref("ru");

// Context
let city = ref(getLocalStorage(CITY_STORAGE_KEY) || "Алмалык");
provide(cityProvide, city);

const {
  data,
  error,
  activeIndex,
  cityPhoto,
  forecastDays,
  activeDayData,
  activeDayHourly,
  getCity,
} = useWeatherForecast(city, locale);

const {
  isModalVisible,
  modalMsg,
  detectLocationByIP,
  confirmDetectedCity,
  declineDetectedCity,
} = useGeoIp(city);

// Detect user location
onMounted(async () => {
  if (!getLocalStorage(CITY_STORAGE_KEY)) await detectLocationByIP();
});
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

    <template v-if="!isModalVisible">
      <CurrentWeatherInfo
        v-if="activeDayData"
        v-bind="activeDayData"
        :bg-image="cityPhoto"
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
