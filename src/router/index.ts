import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/plugins/:id',
          name: 'plugins',
          component: () => import('../views/PluginDetailsView.vue')
        }
      ]
    }
  ]
})

export default router
