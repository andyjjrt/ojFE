import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "./css/vuepress.css";
import "katex/dist/katex.css";

const app = createApp(App);
const pinia = createPinia();

// Prism
import Prism from "prismjs";
// highlight code
import "prismjs/components/prism-json";

VMdPreview.use(vuepressTheme, {
  Prism,
});

app.use(vuetify);
app.use(pinia);
app.use(router);
app.use(VMdPreview);
app.mount("#app");
