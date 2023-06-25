<script setup>
  import { ref } from "vue"
  import { signInWithEmailAndPassword } from "firebase/auth"
  import { auth } from "../firebase.config.js"
  import { useRouter } from "vue-router"


  const username = ref("")
  const password = ref("")
  const router = useRouter()
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, username.value, password.value)
      console.log(auth.currentUser)
      // router.push("/home")
    } catch (error) {
      console.error(error)
    }
  }
 
</script>

<template>
  <h3>Login</h3>
  <form @submit.prevent="login">
    <input v-model="username" type="text" placeholder="Email address">
    <input v-model="password" type="password" placeholder="Password">
    <button>Login</button>
  </form>
</template>