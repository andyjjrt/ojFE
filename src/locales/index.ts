import en from "./en.json"
import zh_TW from "./zh-TW.json"

import vuetify_en from "vuetify/lib/locale/en.mjs"
import vuetify_zhHant from "vuetify/lib/locale/zh-Hant.mjs"

export default {
  en: {
    $vuetify: vuetify_en,
    ...en
  },
  "zh-TW": {
    $vuetify: vuetify_zhHant,
    ...zh_TW
  }
}