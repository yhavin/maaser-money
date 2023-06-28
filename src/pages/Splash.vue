<script setup>
  import { ref } from "vue"
  import Login from '../components/Login.vue'
  import Register from '../components/Register.vue'
  import FooterActions from "../components/FooterActions.vue"
  
  
  const showRegister = ref(false)
  const toggleRegister = () => showRegister.value = !showRegister.value

</script>

<template>
  <main class="container splash">
    <article>
      <hgroup>
        <h1>Track your ma'aser</h1>
        <h3>Earn responsibly</h3>
      </hgroup>
      <div v-if="!showRegister"><Login /></div>
      <span><span v-if="!showRegister">Don't have an account? &nbsp;</span><a v-if="!showRegister" @click="toggleRegister">Sign up</a></span>
      <div v-if="showRegister"><Register /></div>
      <span><span v-if="showRegister">Already have an account? &nbsp;</span><a v-if="showRegister" @click="toggleRegister">Log in</a></span><br />
      <FooterActions />
    </article>
  </main>
</template>

<style scoped>
  a {
    cursor: pointer;
  }

  h1, h3, span, small {
    display: flex;
    justify-content: center;
  }

</style>