import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify, { i18n } from "./plugins/vuetify";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import VMdEditor from "@kangc/v-md-editor";
import Message from "vue-m-message";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/npm";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";
import "@kangc/v-md-editor/lib/style/preview.css";
import "./css/editor.css";
import "./css/message.css";
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
}).use(createKatexPlugin());

VMdEditor.use(vuepressTheme, {
  Prism,
}).use(createKatexPlugin());

VMdEditor.lang.use("en-US", enUS);

Message.setDefault({ className: "elevation-4" });

app.use(i18n)
app.use(vuetify);
app.use(pinia);
app.use(router);
app.use(VMdPreview);
app.use(VMdEditor);
app.use(Message);
app.mount("#app");
