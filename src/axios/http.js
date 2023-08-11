import axios from 'axios'
// 设置baseURL
const http = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 20000
})
export default http;