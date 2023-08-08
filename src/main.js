import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementplus from 'element-plus'
import 'element-plus/dist/index.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000'
// axios全局拦截器，在Header中携带token
axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token')
    console.log(config)
    return config
})

createApp(App).use(store).use(router).use(elementplus).mount('#app')
