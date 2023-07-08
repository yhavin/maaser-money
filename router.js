import { auth } from "./src/firebase.config.js"
import { createRouter, createWebHistory } from "vue-router"
import Splash from "./src/pages/Splash.vue"
import Home from "./src/pages/Home.vue"
import NotFound from "./src/pages/NotFound.vue"


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
      },
      {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: NotFound,
        meta: { requiresAuth: false }
      }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (requiresAuth && !user) {
      next("/auth")
    } else {
      next()
    }
    unsubscribe()
  })
})

export default router