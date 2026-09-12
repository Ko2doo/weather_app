# Weather App — Vue 3 + Vite + Cloudflare Workers

A learning project (Vue.js 3 course): a weather forecast app built with **Vue 3 (Composition API)** and a **Cloudflare Workers** backend. Part of the functionality goes beyond the course scope and was implemented independently.

🔗 Live demo: https://weather-app.galaxyrobotix.workers.dev/

## Overview

A single-page app that shows current weather, a multi-day forecast, and an hourly forecast for the selected day. Data comes from [WeatherAPI](https://www.weatherapi.com/), but the API key never reaches the client — every request is proxied through a dedicated Worker.

## Stack

- **Vue 3** (`<script setup>`, Composition API, `provide/inject`, a custom `v-focus` directive)
- **Vite 8** + `@vitejs/plugin-vue`
- **Cloudflare Workers** as backend/proxy + static hosting (`@cloudflare/vite-plugin`, `wrangler`)
- **SCSS** — a custom design system (variables, mixins, typography, Montserrat fonts)
- **ESLint + Prettier** for consistent code style

## What goes beyond the course assignment

- **Proxy Worker** (`src/worker.js`): two endpoints — `/api/forecast` and `/api/ip-lookup`. The Worker validates `Origin`/`Referer` against an allowlist, sanitizes the `city` parameter with a regex, and only then calls WeatherAPI, attaching the secret key server-side.
- **IP-based city detection**: on first visit (if no city is stored yet) the frontend calls `/api/ip-lookup`; the Worker reads the real client IP from the `cf-connecting-ip` header and asks WeatherAPI for its location. The user is then shown a confirmation modal with the detected city.
- **City name sanitization** (`sanitizeCityName.js`) — WeatherAPI sometimes returns a city with a district in parentheses or after a comma (e.g. `"Tashkent (Shayxontohur tumani)"`); this helper cleans it up before it's stored.
- **Persisting the choice in `localStorage`** (`localeStorageUtils.js`): the user's selected city is remembered between visits (`userCity` key), so IP geolocation only runs on the very first visit.
- **Hourly forecast** (`WeatherHourly.vue`) — a dedicated block rendering an hour-by-hour breakdown for the active day, with its own layout/design not covered by the course.
- **Multi-language support at the API level**: the Worker accepts a `lang` parameter (`ru` / `en` / `uz`) and forwards it to WeatherAPI.
- A custom SCSS design system (no Tailwind/Bootstrap) with a responsive layout.
- **Actually deploying to Cloudflare Workers** — taking the project out of the local environment and shipping it to production (with a Worker proxy, secrets, a `workers.dev` domain) was never part of the course assignment; it's a personal initiative.

## Setup

```bash
git clone https://github.com/Ko2doo/weather_app.git
cd weather_app
npm install
```

The Node.js version is pinned in `.nvmrc` (v24.20.0).

Create a **`.dev.vars`** file in the project root (git-ignored, local-only):

```
WEATHER_API_KEY=your_weatherapi_key
DEV_TEST_IP=8.8.8.8
```

- `WEATHER_API_KEY` — required. Get a free key at [weatherapi.com](https://www.weatherapi.com/); without it `/api/forecast` and `/api/ip-lookup` will return errors.
- `DEV_TEST_IP` — optional. Locally `cf-connecting-ip` is always `127.0.0.1`, so the Worker falls back to this address when testing IP geolocation in development.

Run the dev server (Vite + a local Worker runtime via `@cloudflare/vite-plugin`, single process):

```bash
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Deployment (Cloudflare Workers)

Deploying to production is also not part of the course — it's a standalone step taken independently. The Worker configuration lives in `wrangler.jsonc`: the built `dist` folder is served as static assets, while requests to `/api/*` are handled by `src/worker.js`.

1. Install/log in with the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npx wrangler login`).
2. Set the production secret (the prod equivalent of `.dev.vars`):
   ```bash
   npx wrangler secret put WEATHER_API_KEY
   ```
3. Build and deploy:
   ```bash
   npm run build
   npx wrangler deploy
   ```

More on the platform: [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) and [Cloudflare Vite Plugin](https://developers.cloudflare.com/workers/vite-plugin/).

## Why Cloudflare Workers

The project started as a pure frontend course exercise. A Worker was added on top to:
- keep `WEATHER_API_KEY` out of the client bundle;
- get free edge hosting for both static assets and the API in one service;
- get access to the `cf-connecting-ip` header, needed for accurate client IP detection (the geolocation feature).
