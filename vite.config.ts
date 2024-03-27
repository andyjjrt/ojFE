import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";
import environmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_BACKEND = process.env.VITE_API_BACKEND;
  return defineConfig({
    plugins: [
      vue(),
      vuetify({ styles: { configFile: "./src/css/settings.scss" } }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000,
          globPatterns: [
            "assets/*.{png,svg,jpg,ttf,woff}",
            "**/*.{js,css,html}",
          ],
          runtimeCaching: [
            {
              urlPattern: /\/api\/website/,
              handler: "CacheFirst",
            },
            {
              urlPattern: /\/api\/languages/,
              handler: "CacheFirst",
            },
            {
              urlPattern: /\/api\/profile/,
              handler: "NetworkOnly",
            },
            {
              urlPattern: /\/assets\/*.*.woff2/,
              handler: "CacheFirst",
            },
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/monaco-editor.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'monoco-editor',
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
            }
          ],
        },
      }),
      environmentPlugin({
        VUE_APP_HASH: (+new Date())
          .toString(Math.floor(Math.random() * 5) + 32)
          .slice(-8),
        VUE_APP_VERSION: require("./package.json").version,
      }),
    ],
    server: {
      proxy: {
        "^/api": {
          target: API_BACKEND,
          changeOrigin: true,
          headers: { referer: API_BACKEND },
        },
        "^/public": {
          target: API_BACKEND,
          changeOrigin: true,
          headers: { referer: API_BACKEND },
        },
      },
    },
    build: {
      rollupOptions: {
        plugins: [],
        output: {
          manualChunks: {
            "md-editor-core": [
              "@kangc/v-md-editor",
            ],
            "md-editor-utils": [
              "@kangc/v-md-editor/lib/plugins/katex/npm",
              "@kangc/v-md-editor/lib/preview",
              "@kangc/v-md-editor/lib/theme/vuepress.js",
              "@kangc/v-md-editor/lib/lang/en-US",
            ],
            utils: [
              "axios",
              "chart.js",
              "vue-chartjs",
              "@popperjs/core",
              "v-calendar",
              "prismjs",
              "ua-parser-js",
              "vue-i18n",
              "vue-cropper"
            ],
          },
        },
      },
    },
  });
};
