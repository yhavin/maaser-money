import { auth } from "./src/firebase.config.js"
import { createRouter, createWebHistory } from "vue-router"
import Landing from "./src/pages/Landing.vue"
import Login from "./src/pages/Login.vue"
import Register from "./src/pages/Register.vue"
import Reset from "./src/pages/Reset.vue"
import Home from "./src/pages/Home.vue"
import NotFound from "./src/pages/NotFound.vue"


const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new route
    return { top: 0 }
  },
  routes: [
      {
        path: "/",
        name: "Landing",
        component: Landing,
        meta: { requiresAuth: false }
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { requiresAuth: false }
      },
      {
        path: "/signup",
        name: "Register",
        component: Register,
        meta: { requiresAuth: false }
      },
      {
        path: "/reset",
        name: "Reset",
        component: Reset,
        meta: { requiresAuth: false }
      },
      {
        path: "/app",
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

  // Wait for Firebase Auth to initialize
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (requiresAuth && !user) {
      // Non-logged-in user tries to access app → redirect to login
      next("/login")
    } else if (user && (to.path === "/login" || to.path === "/reset" || to.path === "/")) {
      // Logged-in user tries to visit login/reset/landing pages → redirect to app
      next("/app")
    } else {
      next()
    }
    unsubscribe()
  })
})

export default router