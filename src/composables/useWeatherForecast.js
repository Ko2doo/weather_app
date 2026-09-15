import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { API_FORECAST, CITY_STORAGE_KEY } from "@/lib/constants";
import { localeDateTransform } from "@/lib/dateHelper";
import { setLocalStorage } from "@/lib/localeStorageUtils";
import { getCityPhoto } from "@/lib/wikipediaCityPhoto";

export function useWeatherForecast(city, locale) {
  let data = ref(null);
  let error = ref();
  let activeIndex = ref(null);
  let cityPhoto = ref(null);

  // Hourly time sync
  let now = ref(Date.now());
  let timer = null;

  // Get city data
  async function getCity(cityName, lang = locale.value) {
    const url = new URL(API_FORECAST, window.location.origin);
    url.searchParams.set("city", cityName);
    url.searchParams.set("lang", lang);
    url.searchParams.set("days", "3");

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        error.value = result;
        data.value = null;
        activeIndex.value = null;
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
      activeIndex.value = null;
    }
  }

  // Watchers

  watch(city, (newCity) => {
    getCity(newCity, locale.value);
    setLocalStorage(CITY_STORAGE_KEY, newCity);
  });

  // City photo preview watch
  watch(
    city,
    async (newCity) => {
      cityPhoto.value = await getCityPhoto(newCity, locale.value);
    },
    { immediate: true },
  );

  watch(locale, () => {
    if (city.value) getCity(city.value, locale.value);
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

    if (!activeDay?.hourly) return [];

    const currentHourEpoch = Math.floor(now.value / 1000 / 3600) * 3600;

    return activeDay.hourly.filter(
      (hour) => hour.time_epoch >= currentHourEpoch,
    );
  });

  // Life cicle
  onMounted(() => {
    getCity(city.value);

    timer = setInterval(() => {
      now.value = Date.now();
    }, 60_000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    data,
    error,
    activeIndex,
    cityPhoto,
    forecastDays,
    activeDayData,
    activeDayHourly,
    getCity,
  };
}
