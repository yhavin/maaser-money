<script setup>
  import { ref, computed, onMounted } from "vue"
  import { db } from "../firebase.config.js"
  import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
  import { auth } from "../firebase.config.js"


  const incomeCollectionRef = collection(db, "income")
  const maaserCollectionRef = collection(db, "maaser")

  const userId = auth.currentUser.uid 

  let incomeId = 0
  const newIncome = ref({ description: "", amount: null, date: null, uid: null })
  const incomes = ref([])

  const fetchIncome = async () => {
    const querySnapshot = await getDocs(
      query(incomeCollectionRef, where("uid", "==", userId))
    )
    const fetchedIncomes = []
    querySnapshot.forEach((doc) => {
      fetchedIncomes.push({ id: doc.id, ...doc.data() })
    })
    incomes.value = fetchedIncomes
  }

  const handleSubmitIncome = async () => {
    newIncome.value = { 
      id: incomeId++, 
      description: newIncome.value.description, 
      amount: newIncome.value.amount,
      date: new Date(),
      uid: userId
    }
    const docRef = await addDoc(incomeCollectionRef, newIncome.value)
    console.log("Income added with ID:", docRef.id)
    fetchIncome()
    newIncome.value = { description: "", amount: null, date: null, uid: null }
  }

  const fetchMaaser = async () => {
    const querySnapshot = await getDocs(
      query(maaserCollectionRef, where("uid", "==", userId))
    )
    const fetchedMaasers = []
    querySnapshot.forEach((doc) => {
      fetchedMaasers.push({ id: doc.id, ...doc.data() })
    })
    maasers.value = fetchedMaasers
  }

  let maaserId = 0
  const newMaaser = ref({ description: "", amount: null, date: null, uid: null })
  const maasers = ref([])

  const handleSubmitMaaser = async () => {
    newMaaser.value = { 
      id: maaserId++, 
      description: newMaaser.value.description, 
      amount: newMaaser.value.amount,
      date: new Date(),
      uid: userId
    }
    const docRef = await addDoc(maaserCollectionRef, newMaaser.value)
    console.log("Ma'aser added with ID:", docRef.id)
    fetchMaaser()
    newMaaser.value = { description: "", amount: null, date: null, uid: null }
  }

  onMounted(() => {
    fetchIncome()
    fetchMaaser()
  })

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) =>  sum + income.amount, 0)
  })

  const totalMaaser = computed(() => {
    return maasers.value.reduce((sum, maaser) =>  sum + maaser.amount, 0)
  })

  const maaserDue = computed(() => {
    return (totalIncome.value / 10) - totalMaaser.value
  })

</script>

<template>
  <main class="container">
    <article>
      <div class="grid">
        <form @submit.prevent="handleSubmitIncome">
          <h3>Add income</h3>
          <div class="grid">
            <input v-model="newIncome.description" placeholder="Income">
            <input v-model.number="newIncome.amount" placeholder="Amount">
          </div>
          <button>Add income</button>
        </form>

        <form @submit.prevent="handleSubmitMaaser">
          <h3>Add ma'aser</h3>
          <div class="grid">
            <input v-model="newMaaser.description" placeholder="Ma'aser">
            <input v-model.number="newMaaser.amount" placeholder="Amount">
          </div>
          <button>Add ma'aser</button>
        </form>
      </div>
    </article>

    <article>
      <details open>
        <summary>Income</summary>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(income, index) in incomes" :key="index">
              <td>{{ income.description }}</td>
              <td>{{ income.amount }}</td>
              <td>{{ income.date.toDate().toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </details>

      <details open>
        <summary>Ma'aser</summary>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(maaser, index) in maasers" :key="index">
              <td>{{ maaser.description }}</td>
              <td>{{ maaser.amount }}</td>
              <td>{{ maaser.date.toDate().toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </details>
    </article>
    
    <article>
      <h3>Balance</h3>
      <p>Total income: {{ totalIncome.toLocaleString() }}</p>
      <p>Total ma'aser: {{ totalMaaser.toLocaleString() }}</p>
      <p>Ma'aser due: {{ maaserDue.toLocaleString() }}</p>
    </article>
    
  </main>
</template>