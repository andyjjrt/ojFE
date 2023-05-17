import en from "./en.json"
import zh_Hant from "./zh-Hant.json"

import vuetify_en from "vuetify/lib/locale/en.mjs"
import vuetify_zhHant from "vuetify/lib/locale/zh-Hant.mjs"

export default {
  en: {
    $vuetify: vuetify_en,
    ...en
  },
  "zh-Hant": {
    $vuetify: vuetify_zhHant,
    ...zh_Hant
  }
}