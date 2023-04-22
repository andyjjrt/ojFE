import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { visualizer } from "rollup-plugin-visualizer";
import environmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_BACKEND = process.env.VITE_API_BACKEND;
  return defineConfig({
    plugins: [
      vue(),
      vuetify(),
      visualizer({ filename: "visualizer.html" }),
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
        output: {
          manualChunks: {
            codemirror: [
              "vue-codemirror6",
              "codemirror",
              "@codemirror/view",
              "@codemirror/theme-one-dark",
            ],
            "codemirror-lang": [
              "@codemirror/lang-cpp",
              "@codemirror/lang-java",
              "@codemirror/lang-javascript",
              "@codemirror/lang-python",
              "@codemirror/lang-rust",
            ],
            katex: ["katex"],
            "md-editor": ["@kangc/v-md-editor"],
          },
        },
      },
    },
  });
};
