
// client/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    blueprint: md3,
    components,
    directives,
    ssr: true,
    theme: {
      defaultTheme: 'light',
    },
    defaults: {
      global: {
        style: {
          fontFamily: 'Poppins, sans-serif'
        }
      }
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
