import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/index/Login.vue'
import doctorList from "@/components/backup/DoctorList.vue";
import DeptList from "@/components/backup/DeptList.vue";
//基础信息
import Admin from '@/views/Admin.vue'
import AdminMain from "@/components/admin/AdminMain.vue";
import AdminDept from "@/components/admin/AdminDept.vue";
import AdminDoctor from "@/components/admin/AdminDoctor.vue";
import AdminRegister from "@/components/admin/AdminRegister.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
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
