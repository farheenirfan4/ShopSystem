import { defineNuxtConfig } from "nuxt/config";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/styles/main.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    '@nuxtjs/google-fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  googleFonts: {
    families: {
      Poppins: [100, 200, 300, 400, 500, 600, 700],
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3030', // FeathersJS server
        changeOrigin: true
      }
    }
  },

  // ✅ Added runtimeConfig here
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL
    }
  }
});
