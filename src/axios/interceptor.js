import axios from "axios";
// axios全局拦截器，在Header中携带token
axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem('token');
    console.log(config);
    return config;
})