import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'
import doctorList from "@/components/backup/DoctorList.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path:'/test',
    name:'test',
    component: doctorList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
