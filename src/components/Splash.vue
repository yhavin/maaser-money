<script setup>
  import { ref, onMounted } from "vue"
  import { auth } from "../firebase.config.js"
  import Login from './Login.vue'
  import Register from './Register.vue'
  import Home from "./Home.vue"


  const isAuthenticated = ref(false)

  onMounted(() => {
    auth.onAuthStateChanged((user) => {
      isAuthenticated.value = user !== null
    })
  })
  
  const showRegister = ref(false)
  const toggleRegister = () => showRegister.value = !showRegister.value

</script>

<template>
  <main v-if="!isAuthenticated" class="container">
    <article>
      <hgroup>
        <h1>Track your ma'aser</h1>
        <h3>Earn responsibly</h3>
      </hgroup>
      <div v-if="!showRegister"><Login /></div>
      <a v-if="!showRegister" @click="toggleRegister">Don't have an account? Create one</a>
      <div v-if="showRegister"><Register /></div>
      <a v-if="showRegister" @click="toggleRegister">Already have an account?</a>
    </article>
  </main>
  <div v-if="isAuthenticated"><Home /></div>
</template>

<style scoped>
  a {
    cursor: pointer;
  }
</style>