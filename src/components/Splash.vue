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
      <span v-if="!showRegister">Don't have an account? &nbsp;</span><a v-if="!showRegister" @click="toggleRegister">Sign up</a>
      <div v-if="showRegister"><Register /></div>
      <span v-if="showRegister">Already have an account? &nbsp;</span><a v-if="showRegister" @click="toggleRegister">Log in</a>
    </article>
  </main>
</template>

<style scoped>
  a {
    cursor: pointer;
  }
</style>