import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'
import doctorList from "@/components/backup/DoctorList.vue";
import outDoctorMain from "@/components/outdoctor/OutDoctorMain.vue";

const routes = [
  {
    path:'/test',
    name:'test',
    component: doctorList
  },
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/outdoctor',
    name: 'outdoctor',
    component: outDoctorMain
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
