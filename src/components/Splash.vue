<script setup>
  import { ref } from "vue"
  import Login from './Login.vue'
  import Register from './Register.vue'
  
  
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
      <span class="gutter-text">Feedback and suggestions welcome by&nbsp;<a href="mailto:y.havin@gmail.com?subject=Ma%27aser%20app%20feedback">email</a></span>
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

  .gutter-text {
    font-size: 13px;
  }
</style>