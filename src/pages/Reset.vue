<template>
  <main class="container splash">
    <article>
      <img src="/img/icons/logo-circle.png" class="logo">
      <h3>Reset password</h3>
      <form v-if="!resetSent" @submit.prevent="resetPassword(resetEmail)">
        <input v-model="resetEmail" type="text" placeholder="Email address" required>
        <button>Send reset email</button>
      </form>
      
      <div v-if="resetSent">
        <span>Password reset email sent.</span>
      </div>
      
      <span>
        <span>Remember your password? &nbsp;</span>
        <router-link to="/login">Log in</router-link>
      </span>
      <span>
        <span>Don't have an account? &nbsp;</span>
        <router-link to="/signup">Sign up</router-link>
      </span>
    </article>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { auth } from "../firebase.config.js"
import { sendPasswordResetEmail } from "firebase/auth"

const resetSent = ref(false)
const resetEmail = ref("")

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    resetSent.value = true
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
</script>

<style scoped>
a {
  cursor: pointer;
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
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