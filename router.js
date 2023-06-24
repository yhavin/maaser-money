import { createRouter, createWebHistory } from "vue-router"
import Splash from "./src/components/Splash.vue"
import Home from "./src/components/Home.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
        path: "/",
        name: "Splash",
        component: Splash
      },
      {
        path: "/home",
        name: "Home",
        component: Home
      }
  ]
})

export default router