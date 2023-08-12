import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'
import doctorList from "@/components/backup/DoctorList.vue";
import outDoctorMain from "@/components/outdoctor/OutDoctorMain.vue";
import Medrecord from "@/components/outdoctor/OutDoctorMedrecord.vue"
import Checkout from "@/components/outdoctor/OutDoctorCheckcout.vue"

import DeptList from "@/components/backup/DeptList.vue";
//基础信息
import Admin from '@/views/Admin.vue'
import AdminMain from "@/components/admin/AdminMain.vue";
import AdminDept from "@/components/admin/AdminDept.vue";
import AdminDoctor from "@/components/admin/AdminDoctor.vue";
import AdminRegister from "@/components/admin/AdminRegister.vue";

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
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    children:[
      {
        path: '',
        name: 'main',
        component: AdminMain
      },
      {
        path: 'dept',
        component: DeptList
      },
      {
        path: 'doc',
        component: doctorList
      },
      {
        path: 'reg',
        component: AdminRegister
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
