<script setup>
import locationIcon from "@icons/gps.svg?raw";

defineProps({
  datetime: String,
  currentDay: String,
  currentDate: String,
  location: String,
  weatherIcon: String,
  currentTemp: String,
  currentText: String,
});
</script>

<template>
  <section class="current-weather-info">
    <time :datetime="datetime" class="current-day">
      <h1 class="current-dayname">{{ currentDay }}</h1>
      <p class="current-date">{{ currentDate }}</p>
      <p class="current-location">
        <span class="icon" v-html="locationIcon"></span>
        {{ location }}
      </p>
    </time>

    <div class="current-weather">
      <img :src="weatherIcon" :alt="currentText" class="weather-icon" />
      <span class="current-temp">{{ currentTemp }}</span>
      <span class="current-text">{{ currentText }}</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "@styles/tools/tools" as *;

.current-weather-info {
  width: 100%;

  display: flex;
  flex-wrap: wrap;

  justify-content: space-between;
  align-items: center;

  padding: clamp(rem(16), 4vw, rem(32)) clamp(rem(24), 4vw, rem(48));
  margin: 0 var(--space-size-l);

  overflow: hidden;

  background-image: url("@assets/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  color: var(--primary-color);

  border-radius: var(--border-radius-xl);

  @media (min-width: rem(1200)) {
    flex-wrap: unset;
    align-items: flex-start;
    flex-direction: column;

    justify-content: space-between;

    width: rem(490);
    min-height: rem(666);

    margin: 0;
  }
}

.current-day {
  display: flex;
  flex-direction: column;

  gap: rem(16);
}

.current-date {
  font-size: var(--fsize-subtitle);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;
}

.current-dayname {
  font-size: var(--fsize-heading);
  font-weight: var(--fweight-medium);
  line-height: normal;

  display: block;
}

.current-location {
  font-size: var(--fsize-l);
  font-weight: var(--fweight-semibold);
  line-height: normal;

  display: block;

  .icon {
    width: 27px;
    height: 27px;

    margin-right: rem(8);

    object-fit: cover;
  }
}

.current-weather {
  width: 100%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: rem(8);

  text-align: center;

  @media (min-width: rem(460)) {
    width: fit-content;
  }

  @media (min-width: rem(1200)) {
    align-items: flex-start;
    text-align: left;
  }
}

.weather-icon {
  width: 95px;
  height: 95px;

  object-fit: cover;
}

.current-temp {
  font-size: clamp(rem(36), 4vw, rem(50));
  font-weight: var(--fweight-bold);
  line-height: normal;

  display: block;
}

.current-text {
  font-size: clamp(rem(28), 4vw, rem(30));
  font-weight: var(--fweight-bold);
  line-height: normal;

  display: block;
}
</style>
