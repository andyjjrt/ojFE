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
import "./css/message.css";
import "./css/vuepress.css";
import "katex/dist/katex.css";
import katex from "katex";
import { config } from "md-editor-v3";
import Tips from "./utils/markdown-tip";
import "md-editor-v3/lib/style.css";
import "./css/editor.css"
import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";

const app = createApp(App);
const pinia = createPinia();

config({
  markdownItConfig(mdit) {
    mdit.use(Tips);
  },
  editorExtensions: { katex: { instance: katex } },
});

Message.setDefault({ className: "elevation-4" });

app.use(i18n);
app.use(vuetify);
app.use(pinia);
app.use(router);
app.use(Message);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
  },
});
app.mount("#app");
