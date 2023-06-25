<script setup>
  import { ref } from "vue"
  import Login from './Login.vue'
  import Register from './Register.vue'
  
  
  const showRegister = ref(false)
  const toggleRegister = () => showRegister.value = !showRegister.value

</script>

<template>
  <main class="container">
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
</template>

<style scoped>
  a {
    cursor: pointer;
  }
</style>