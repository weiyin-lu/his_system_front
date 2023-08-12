import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'
import doctorList from "@/components/backup/DoctorList.vue";
import outDoctorMain from "@/components/outdoctor/OutDoctorMain.vue";
import Medrecord from "@/components/outdoctor/OutDoctorMedrecord.vue"
import Checkout from "@/components/outdoctor/OutDoctorCheckcout.vue"
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
    component: outDoctorMain,
    children: [
      {path: '/outdoctor/medrecord',name:'medrecord',component:Medrecord},
      {path: '/outdoctor/checkout',name:'checkout',component:Checkout}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
