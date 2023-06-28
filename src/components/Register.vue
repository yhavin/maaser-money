<script setup>
  import { ref } from "vue"
  import { createUserWithEmailAndPassword, updateProfile, setPersistence, browserLocalPersistence } from "firebase/auth"
  import { collection, addDoc } from "firebase/firestore"
  import { db, auth } from "../firebase.config.js"
  import { useRouter } from "vue-router"

  
  const firstName = ref("")
  const lastName = ref("")
  const username = ref("")
  const password = ref("")

  const router = useRouter()
  const userCollectionRef = collection(db, "users")

  const register = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      const { user } = await createUserWithEmailAndPassword(auth, username.value, password.value)
      await updateProfile(user, {
        displayName: `${firstName.value} ${lastName.value}`
      })
      router.push("/")
      addUser()
    } catch (error) {
      console.error(error)
    }
  }

  const addUser = async () => {
    const user = {
      uid: auth.currentUser.uid,
      firstName: firstName.value,
      lastName: lastName.value,
      email: username.value,
      createdAt: new Date()
    }
    try {
      const docRef = await addDoc(userCollectionRef, user)
      console.log("User created with ID:", docRef.id)
    } catch (error) {
      console.error(error)
    }
  }

</script>

<template>
  <h3>Create your account</h3>
  <form @submit.prevent="register">
    <input v-model="firstName" type="text" placeholder="First name" autocomplete="new-first-name">
    <input v-model="lastName" type="text" placeholder="Last name" autocomplete="new-last-name">
    <input v-model="username" type="text" placeholder="Email address" autocomplete="new-username">
    <input v-model="password" type="password" placeholder="Password" autocomplete="new-password">
    <button>Continue</button>
  </form>
</template>

<style scoped>
  a {
    cursor: pointer;
  }

  h3 {
    display: flex;
    justify-content: center;
  }
</style>