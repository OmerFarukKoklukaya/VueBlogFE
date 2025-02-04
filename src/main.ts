import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/routers'
import axios from 'axios'
import App from '@/App.vue'

axios.defaults.baseURL= 'http://localhost:3000/api'
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')
