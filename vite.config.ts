import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const API_BACKEND = process.env.VITE_API_BACKEND;
  return defineConfig({
    plugins: [vue(), vuetify(), visualizer({ filename: "visualizer.html" })],
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
            codemirror: ["vue-codemirror6", "codemirror", "@codemirror/view"],
            "codemirror-lang": ["@codemirror/lang-cpp"],
            katex: ["katex"],
            "md-editor": ["@kangc/v-md-editor"],
          },
        },
      },
    },
  });
};
