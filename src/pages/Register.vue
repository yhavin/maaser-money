<template>
  <main class="container splash">
    <article>
      <img src="/img/icons/logo-circle.png" class="logo">
      <h3>Create your account</h3>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Email address" autocomplete="new-username" required :aria-invalid="invalidEmailRegister">
        <small v-if="invalidEmailRegister" class="error">{{ emailErrorMessage }}</small>
        <input v-model="password" type="password" placeholder="Password" autocomplete="new-password" required :aria-invalid="invalidPasswordRegister">
        <small v-if="!invalidPasswordRegister">Password must be at least six characters</small>
        <small v-if="invalidPasswordRegister" class="error">{{ passwordErrorMessage }}</small>
        <select v-model="currency" required>
          <option disabled value="" selected>Currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index>{{ currency }}</option>
        </select>
        <button>Continue</button>
      </form>
      <span>
        <span>Already have an account? &nbsp;</span>
        <router-link to="/login">Log in</router-link>
      </span>
    </article>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { db, auth } from "../firebase.config.js"
import { useRouter } from "vue-router"
import { currencyOptions } from '../utils/constants'

const router = useRouter()

const username = ref("")
const password = ref("")
const currency = ref("")

const invalidEmailRegister = ref()
const emailErrorMessage = ref()
const invalidPasswordRegister = ref()
const passwordErrorMessage = ref()

const mapAuthEmailErrors = {
  "auth/email-already-exists": "This email address is already in use",
  "auth/email-already-in-use": "This email address is already in use",
  "auth/invalid-email": "Please enter a valid email address",
}

const mapAuthPasswordErrors = {
  "auth/weak-password": "Password must be at least six characters"
}

const userCollectionRef = collection(db, "users")

const register = async () => {
    try {
    await setPersistence(auth, browserLocalPersistence)
    await createUserWithEmailAndPassword(auth, username.value, password.value)
    invalidEmailRegister.value = false
    invalidPasswordRegister.value = false
    router.push("/app")
    addUser()
  } catch (error) {
    console.log(error)
    emailErrorMessage.value = mapAuthEmailErrors[error.code] || null
    invalidEmailRegister.value = emailErrorMessage.value ? true : null
    passwordErrorMessage.value = password.value.trim().length < 6 ? mapAuthPasswordErrors["auth/weak-password"] : mapAuthPasswordErrors[error.code] || null
    invalidPasswordRegister.value = passwordErrorMessage.value ? true : password.value.trim().length < 6 ? true : null
  }
}

const addUser = async () => {
  const user = {
    uid: auth.currentUser.uid,
    currency: currency.value,
    email: username.value,
    createdAt: new Date()
  }
  try {
    await addDoc(userCollectionRef, user)
    console.log("User created")
  } catch (error) {
    console.error(error)
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

.error {
  color: #c62828;
}
</style>