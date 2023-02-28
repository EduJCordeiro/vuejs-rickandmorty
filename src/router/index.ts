import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '@/components/Character.vue'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/character/:id',
      name: 'character',
      component: CharacterView
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
