import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";

const app = createApp(App);

// Custom directives (v-focus)
app.directive("focus", {
  mounted: (el) => el.focus(),
});

app.mount("#app");
