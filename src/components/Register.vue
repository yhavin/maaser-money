<script setup>
  import { ref } from "vue"
  import { createUserWithEmailAndPassword } from "firebase/auth"
  import { auth } from "@/firebase"

  
  const username = ref("")
  const password = ref("")

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username.value, password.value)
    } catch (error) {
      console.error(error)
    }
  }

</script>

<template>
  <article>
    <h3>Register</h3>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Email address">
      <input v-model="password" type="password" placeholder="Password">
      <button>Create account</button>
    </form>
  </article>
</template>