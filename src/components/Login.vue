<script setup>
  import { ref } from "vue"
  import { signInWithEmailAndPassword } from "firebase/auth"
  import { auth } from "@/firebase"


  const username = ref("")
  const password = ref("")
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, username.value, password.value)
    } catch (error) {
      console.error(error)
    }
  }
 
</script>

<template>
<article>
    <h3>Login</h3>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Email address">
      <input v-model="password" type="password" placeholder="Password">
      <button>Login</button>
    </form>
  </article>
</template>