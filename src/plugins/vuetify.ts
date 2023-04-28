import "../css/main.scss";
import "@mdi/font/css/materialdesignicons.css";
import { ThemeDefinition, createVuetify } from "vuetify";

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

export default createVuetify({
  defaults: {
    VCard: {
      elevation: 5,
      rounded: "lg",
    },
    VDialog: {
      transition: "scroll-y-transition",
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
