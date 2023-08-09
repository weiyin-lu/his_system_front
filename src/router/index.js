import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Doctor from '../views/Doctor.vue'
import Dept from '../views/Dept.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/doctors',
    name: 'doctors',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Doctor
  },
  {
    path: '/depts',
    name: 'depts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Dept
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
