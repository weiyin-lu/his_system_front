import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'

import outDoctorMain from "@/components/outdoctor/OutDoctorMain.vue";
import Medrecord from "@/components/outdoctor/OutDoctorMedrecord.vue"
import Checkout from "@/components/outdoctor/OutDoctorCheckcout.vue"

import medicineMain from '@/components/medicine/MedicineMain.vue'
import medicineCore from '@/components/medicine/MedicineCore.vue'
import medicineManage from '@/components/medicine/MedicineManage.vue'

import Admin from '@/views/Admin.vue'
import AdminMain from "@/components/admin/AdminMain.vue";
import AdminDept from "@/components/admin/AdminDept.vue";
import AdminDoctor from "@/components/admin/AdminDoctor.vue";
import AdminRegister from "@/components/admin/AdminRegister.vue";
import outPatientMain from "@/components/outpatient/OutPatientMain.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  //   门诊模块
  {
    path: '/outdoctor',
    component: outDoctorMain,
    children: [
      {path: '/outdoctor/medrecord',name:'medrecord',component:Medrecord},
      {path: '/outdoctor/checkout',name:'checkout',component:Checkout}
    ]
  },
  //   药房模块
  {
    path: '/medicine',
    component: medicineMain,
  },
  {
    path: '/medicine/core',
    name:'core',
    component:medicineCore},
  {
    path: '/medicine/manage',
    name:'manage',
    component:medicineManage
  },
  //   挂号模块
  {
    path: '/outpatient',
    component:outPatientMain
  },
  //   基本信息维护模块
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
        component: AdminDept
      },
      {
        path: 'doc',
        component: AdminDoctor
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
