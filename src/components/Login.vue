<script setup>
  import { ref } from "vue"
  import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
  import { auth } from "../firebase.config.js"
  import { useRouter } from "vue-router"


  const username = ref("")
  const password = ref("")
  const router = useRouter()
  
  const login = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, username.value, password.value)
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }
 
</script>

<template>
  <h3>Welcome back</h3>
  <form @submit.prevent="login">
    <input v-model="username" type="text" placeholder="Email address">
    <input v-model="password" type="password" placeholder="Password">
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
</style>