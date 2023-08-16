import axios from 'axios'
// 设置baseURL
const http = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 20000
})
// axios全局拦截器，在Header中携带token
http.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token');
    return config;
})
export default http;