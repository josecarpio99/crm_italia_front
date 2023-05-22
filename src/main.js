window.AppConfig = {
  name: 'CRM_ITALIA',
  // logo: 'logo',
  url: import.meta.env.VITE_APP_BASE_URL,
  csrf: '{{ csrf_token() }}',
  defaultLocale: 'en',
  defaultTimezone: 'America/Mexico_City',  
}


import {createApp} from 'vue'
import { createPinia } from 'pinia'


       

import router from "@/router";
import i18n from "@/plugins/i18n";
import App from "@/App";

import "./styles/main.css";
import "./styles/icons.css";


const app = createApp(App)

app.use(createPinia());

app.use(router);
app.use(i18n);

app.mount('#app');




