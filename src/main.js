import { createApp } from 'vue'
import App from './App.vue'
import router from '../router.js'
import { auth } from "./firebase.config.js"


const app = createApp(App)
app.use(router)

router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.currentUser !== null

  if (to.meta.isAuthenticated && !isAuthenticated) {
    next("/")
  } else { 
    next()
  }
})

app.mount('#app')
