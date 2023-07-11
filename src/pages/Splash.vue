<script setup>
  import { ref } from "vue"
  import Login from '../components/Login.vue'
  import Reset from "../components/Reset.vue"
  import Register from '../components/Register.vue'
  
  
  const showLogin = ref(true)
  const toggleLogin = () => {
    showLogin.value = !showLogin.value
    showRegister.value = false
    showReset.value = false
  }
  
  const showRegister = ref(false)
  const toggleRegister = () => {
    showRegister.value = !showRegister.value
    showLogin.value = false
    showReset.value = false
  }

  const showReset = ref(false)
  const toggleReset = () => {
    resetSent.value = false
    showReset.value = !showReset.value
    showLogin.value = false
    showRegister.value = false
  }

  const resetSent = ref(false)
  const setResetSent = () => {
    resetSent.value = true
    showRegister.value = false
    console.log(showRegister.value)
  }

</script>

<template>
  <main class="container splash">
    <article>
      <img src="/img/icons/logo-circle.png" class="logo">
      <!-- <hgroup>
        <h1>Ma'aser Money</h1>
        <h3>Earn responsibly</h3>
      </hgroup> -->
      <div v-if="showLogin"><Login /></div>
      <span><span v-if="showLogin">Don't have an account? &nbsp;</span><a v-if="showLogin" @click="toggleRegister">Sign up</a></span>
      <span><a v-if="showLogin" @click="toggleReset">Forgot password?</a></span>
      <div v-if="showReset"><Reset :resetSent="resetSent" @setResetSent="setResetSent" /></div>
      <span><span v-if="showReset">Don't have an account? &nbsp;</span><a v-if="showReset" @click="toggleRegister">Sign up</a></span>
      <div v-if="showRegister"><Register /></div>
      <span><span v-if="showRegister">Already have an account? &nbsp;</span><a v-if="showRegister" @click="toggleLogin">Log in</a></span><br />
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

  .splash {
    width: 100%;
    margin: 0 auto;
  }

@media (min-width: 768px) {
  .splash {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.logo {
  width: 20%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 5%;
}

</style>