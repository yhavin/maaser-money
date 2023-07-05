<script setup>
  import { ref } from "vue"
  import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
  import { auth } from "../firebase.config.js"
  import { useRouter } from "vue-router"


  const username = ref("")
  const password = ref("")

  const invalidLogin = ref()
  const errorMessage = ref()

  const router = useRouter()

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
      router.push("/")
    } catch (error) {
      errorMessage.value = mapAuthErrors[error.code]
      invalidLogin.value = true
      console.log(errorMessage.value)
    }
  }
 
</script>

<template>
  <h3>Welcome back</h3>
  <form @submit.prevent="login">
    <input v-model="username" type="text" placeholder="Email address" :aria-invalid="invalidLogin">
    <input v-model="password" type="password" placeholder="Password" :aria-invalid="invalidLogin">
    <small class="error" v-if="errorMessage">{{ errorMessage }}</small>
    <button>Continue</button>
  </form>
</template>

<style scoped>
  a {
    cursor: pointer;
  }

  h3 {
    display: flex;
    justify-content: center;
  }

  .error {
    color: #c62828
  }
</style>