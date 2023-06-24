<script setup>
  import { ref } from "vue"
  import { createUserWithEmailAndPassword } from "firebase/auth"
  import { auth } from "../firebase.config.js"
  import { useRouter } from "vue-router"

  
  const username = ref("")
  const password = ref("")
  const router = useRouter()

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username.value, password.value)
      router.push("/home")
    } catch (error) {
      console.error(error)
    }
  }

</script>

<template>
  <h3>Register</h3>
  <form @submit.prevent="register">
    <input v-model="username" type="text" placeholder="Email address" autocomplete="new-username">
    <input v-model="password" type="password" placeholder="Password" autocomplete="new-password">
    <button>Create account</button>
  </form>
</template>