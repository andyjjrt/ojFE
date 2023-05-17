import "../css/main.scss";
import "@mdi/font/css/materialdesignicons.css";
import { ThemeDefinition, createVuetify } from "vuetify";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { createI18n, useI18n } from "vue-i18n";
import locales from "../locales";

const light: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#7986CB",
    "primary-darken-1": "#5C6BC0",
    secondary: "#00897B",
    "secondary-darken-1": "#00796B",
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#5C6BC0",
    "primary-darken-1": "#3949AB",
    secondary: "#00796B",
    "secondary-darken-1": "#00695C",
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: "zh-Hant",
  fallbackLocale: "en",
  messages: locales,
});

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  defaults: {
    VCard: {
      elevation: 5,
      rounded: "lg",
    },
    VDialog: {
      transition: "scroll-y-transition",
    },
    VTextField: {
      color: "primary",
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light,
      dark,
    },
  },
});
