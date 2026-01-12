import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(autoAnimatePlugin)
app.mount('#app')
