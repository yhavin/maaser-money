import { createRouter, createWebHistory } from "vue-router"
import Splash from "./src/components/Splash.vue"
import Home from "./src/components/Home.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
        path: "/",
        name: "Splash",
        component: Splash,
        meta: { requiresAuth: false }
      },
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true }
      }
  ]
})

export default router