import { auth } from "./src/firebase.config.js"
import { createRouter, createWebHistory } from "vue-router"
import Splash from "./src/pages/Splash.vue"
import Home from "./src/pages/Home.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
        path: "/auth",
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => {record.meta.requiresAuth})
  const isAuthenticated = auth.currentUser !== null

  if (requiresAuth && !isAuthenticated) {
    next("/auth")
  } else {
    next()
  }
})

export default router