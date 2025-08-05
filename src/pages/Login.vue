<template>
  <main class="container splash">
    <article>
      <img src="/img/icons/logo-circle.png" class="logo">
      <h3>Welcome back</h3>
      <form @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Email address" :aria-invalid="invalidLogin">
        <input v-model="password" type="password" placeholder="Password" :aria-invalid="invalidLogin">
        <small class="error" v-if="invalidLogin">{{ errorMessage }}</small>
        <button>Continue</button>
      </form>
      <span>
        <span>Don't have an account? &nbsp;</span>
        <router-link to="/signup">Sign up</router-link>
      </span>
      <span>
        <router-link to="/reset">Forgot password?</router-link>
      </span>
    </article>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { auth } from "../firebase.config.js"
import { useRouter } from "vue-router"

const router = useRouter()

const username = ref("")
const password = ref("")

const invalidLogin = ref()
const errorMessage = ref()

const mapAuthErrors = {
  "auth/wrong-password": "The credentials you entered are incorrect",
  "auth/invalid-email": "The credentials you entered are incorrect",
  "auth/user-not-found": "The credentials you entered are incorrect",
}

const login = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence)
    await signInWithEmailAndPassword(auth, username.value, password.value)
    invalidLogin.value = false
    errorMessage.value = null
    router.push("/app")
  } catch (error) {
    errorMessage.value = mapAuthErrors[error.code]
    invalidLogin.value = true
  }
}
</script>

<style scoped>
a {
  cursor: pointer;
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h3, span, small {
  display: flex;
  justify-content: center;
}

.splash {
  width: 100%;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .splash {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.logo {
  width: 20%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 5%;
}

.error {
  color: #c62828;
}
</style>