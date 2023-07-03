<script setup>
  import { ref } from "vue"
  import { auth } from "../firebase.config.js"
  import { sendPasswordResetEmail } from "firebase/auth"


  const props = defineProps({
    resetSent: Boolean
  })

  const emits = defineEmits(["setResetSent"])

  const emitSetResetSent = () => {
    emits("setResetSent")
  }
  
  const resetEmail = ref("")
  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      emitSetResetSent()
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }
</script>

<template>
  <h3>Reset password</h3>
  <form v-if="!resetSent" @submit.prevent="resetPassword(resetEmail)">
    <input v-model="resetEmail" type="text" placeholder="Email address">
    <button>Send reset email</button>
  </form>
  
  <div v-if="resetSent">
    <span>Password reset email sent.</span>
  </div>
</template>

<style scoped>
  h1, h3, span, small {
  display: flex;
  justify-content: center;
  }
</style>