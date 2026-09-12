# Weather App — Vue 3 + Vite + Cloudflare Workers
[English version](/README.en.md)


Учебный проект (курс по Vue.js 3): приложение прогноза погоды на **Vue 3 (Composition API)** с бэкендом на **Cloudflare Workers**. Часть функциональности выходит за рамки курса и реализована самостоятельно.

🔗 Демо: https://weather-app.galaxyrobotix.workers.dev/

## Что это

Одностраничное приложение, которое показывает текущую погоду, прогноз на несколько дней и почасовой прогноз для выбранного дня. Данные берутся из [WeatherAPI](https://www.weatherapi.com/), но ключ API никогда не попадает на клиент — все запросы проксируются через собственный Worker.

## Стек

- **Vue 3** (`<script setup>`, Composition API, `provide/inject`, кастомная директива `v-focus`)
- **Vite 8** + `@vitejs/plugin-vue`
- **Cloudflare Workers** как бэкенд/прокси + статический хостинг (`@cloudflare/vite-plugin`, `wrangler`)
- **SCSS** — собственная дизайн-система (переменные, миксины, типографика, шрифты Montserrat)
- **ESLint + Prettier** для единого стиля кода

## Что реализовано сверх программы курса

- **Прокси-Worker** (`src/worker.js`): два эндпоинта — `/api/forecast` и `/api/ip-lookup`. Worker валидирует `Origin`/`Referer` (allowlist), санитизирует параметр `city` регуляркой и только затем обращается к WeatherAPI, подставляя секретный ключ на серверной стороне.
- **Определение города по IP**: при первом визите (если город ещё не сохранён) фронтенд стучится в `/api/ip-lookup`, Worker берёт реальный IP клиента из заголовка `cf-connecting-ip` и запрашивает геолокацию у WeatherAPI. Пользователю показывается модальное окно с подтверждением обнаруженного города.
- **Санитизация названия города** (`sanitizeCityName.js`) — WeatherAPI иногда возвращает город с районом в скобках или через запятую (`"Tashkent (Shayxontohur tumani)"`), функция приводит его к чистому виду перед сохранением.
- **Сохранение выбора в `localStorage`** (`localeStorageUtils.js`): выбранный пользователем город запоминается между визитами (ключ `userCity`), IP-геолокация запускается только при первом заходе.
- **Почасовой прогноз** (`WeatherHourly.vue`) — отдельный блок вывода погоды по часам для активного (выбранного) дня, с собственной вёрсткой/дизайном, не входившей в задание курса.
- **Мультиязычность на уровне API**: Worker поддерживает `lang` (`ru` / `en` / `uz`) и передаёт его в WeatherAPI.
- Собственная дизайн-система на SCSS (не Tailwind/Bootstrap) с адаптивной вёрсткой.
- **Реальный деплой на Cloudflare Workers** — сама идея вынести проект за пределы локального окружения и выложить в прод (с Worker-прокси, секретами, доменом `workers.dev`) не входила в задание курса, это личная инициатива.

## Установка и запуск

```bash
git clone https://github.com/Ko2doo/weather_app.git
cd weather_app
npm install
```

Версия Node.js зафиксирована в `.nvmrc` (v24.20.0).

Создайте файл **`.dev.vars`** в корне проекта (не коммитится, используется только локально):

```
WEATHER_API_KEY=ваш_ключ_с_weatherapi.com
DEV_TEST_IP=8.8.8.8
```

- `WEATHER_API_KEY` — обязательный. Ключ выдаётся бесплатно на [weatherapi.com](https://www.weatherapi.com/); без него `/api/forecast` и `/api/ip-lookup` вернут ошибку.
- `DEV_TEST_IP` — опциональный. Локально `cf-connecting-ip` всегда `127.0.0.1`, поэтому для отладки IP-геолокации Worker подставляет вместо него этот адрес.

Запуск дев-сервера (Vite + локальный Worker через `@cloudflare/vite-plugin`, единый процесс):

```bash
npm run dev
```

Сборка и предпросмотр:

```bash
npm run build
npm run preview
```

## Деплой (Cloudflare Workers)

Деплой в прод — тоже не часть курса, а самостоятельный шаг. Конфигурация Worker описана в `wrangler.jsonc`: собранный `dist` раздаётся как статические ассеты, а запросы к `/api/*` перехватывает `src/worker.js`.

1. Установите/авторизуйте [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npx wrangler login`).
2. Задайте секрет на проде (аналог `.dev.vars`, но для продакшена):
   ```bash
   npx wrangler secret put WEATHER_API_KEY
   ```
3. Соберите и задеплойте:
   ```bash
   npm run build
   npx wrangler deploy
   ```

Подробнее о платформе — [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) и [Cloudflare Vite Plugin](https://developers.cloudflare.com/workers/vite-plugin/).

## Почему Cloudflare Workers

Изначально проект — чисто фронтендовый (учебный курс по Vue). Worker добавлен дополнительно, чтобы:
- не светить `WEATHER_API_KEY` в клиентском бандле;
- получить бесплатный edge-хостинг для статики и API в одном сервисе;
- иметь доступ к заголовку `cf-connecting-ip` для честного определения IP пользователя (нужно для фичи геолокации).
