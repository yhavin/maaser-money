<script setup>
  import { ref, computed, onMounted } from "vue"
  import { db, auth } from "../firebase.config.js"
  import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore"
  import { signOut, onAuthStateChanged } from "firebase/auth"
  import { useRouter } from "vue-router"


  onMounted(() => {
    fetchIncome()
    fetchMaaser()
  })
  
  const router = useRouter()

  const logout = () => {
    signOut(auth)
    router.push("/auth")
  }
  
  const incomeCollectionRef = collection(db, "income")
  const maaserCollectionRef = collection(db, "maaser")

  const userId = auth.currentUser.uid 

  const newIncome = ref({ description: "", amount: null, date: null, percent: "10%", uid: null })
  const incomes = ref([])

  const formatPercent = (number=10) => {
    let value = null
    if (number.endsWith("%")) {
      value = parseFloat(number.replace("%", ""))
    } else {
      value = parseFloat(number)
    }
    return value / 100
  }

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
      description: newIncome.value.description, 
      amount: newIncome.value.amount,
      date: new Date(),
      percent: formatPercent(newIncome.value.percent),
      uid: userId
    }
    const docRef = await addDoc(incomeCollectionRef, newIncome.value)
    console.log("Income added with ID:", docRef.id)
    fetchIncome()
    newIncome.value = { description: "", amount: null, date: null, percent: "10%", uid: null }
  }

  const handleDeleteIncome = async (id) => {
    await deleteDoc(doc(incomeCollectionRef, id))
    fetchIncome()
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

  const newMaaser = ref({ description: "", amount: null, date: null, uid: null })
  const maasers = ref([])

  const handleSubmitMaaser = async () => {
    newMaaser.value = { 
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

  const handleDeleteMaaser = async (id) => {
    await deleteDoc(doc(maaserCollectionRef, id))
    fetchMaaser()
  }

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) =>  sum + income.amount, 0)
  })

  const totalMaaser = computed(() => {
    return maasers.value.reduce((sum, maaser) =>  sum + maaser.amount, 0)
  })

  const maaserDue = computed(() => {
    let owing = 0
    incomes.value.forEach((income) => {
      owing += (income.amount * income.percent)
    })
    return owing - totalMaaser.value
  })

</script>

<template>
  <main class="container">
    <nav>
      <ul>
        <li>Logged in as <strong>{{ auth.currentUser.email }}</strong></li>
      </ul>
      <ul>
        <li><a @click="logout" >Logout</a></li>
      </ul>
    </nav>
    <article>
      <div class="grid">
        <form @submit.prevent="handleSubmitIncome">
          <h3>Add income</h3>
          <div class="grid">
            <input v-model="newIncome.description" placeholder="Description">
            <input v-model.number="newIncome.amount" placeholder="Amount">
            <select v-model="newIncome.percent">
              <option value="10%" selected>10%</option>
              <option value="15%">15%</option>
              <option value="20%">20%</option>
              <option value="25%">25%</option>
            </select>
          </div>
          <button>Add income</button>
        </form>

        <form @submit.prevent="handleSubmitMaaser">
          <h3>Add ma'aser</h3>
          <div class="grid">
            <input v-model="newMaaser.description" placeholder="Description">
            <input v-model.number="newMaaser.amount" placeholder="Amount">
          </div>
          <button>Add ma'aser</button>
        </form>
      </div>
    </article>

    <article>
      <h3>Balance</h3>
      <p>Total income: {{ totalIncome.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</p>
      <p>Total ma'aser: {{ totalMaaser.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</p>
      <p>Ma'aser due: {{ maaserDue.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</p>
    </article>

    <article>
      <h3>Transactions</h3>
      <details open>
        <summary>Income</summary>
        <figure>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(income, index) in incomes" :key="index">
                <td>{{ income.description }}</td>
                <td>{{ income.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) + " (" + ((income.percent * 100).toFixed(0) + "%)") }}</td>
                <td>{{ income.date.toDate().toLocaleDateString() }}</td>
                <td><a @click="handleDeleteIncome(income.id)">Delete</a></td>
              </tr>
            </tbody>
          </table>
        </figure>
      </details>

      <details open>
        <summary>Ma'aser</summary>
        <figure>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(maaser, index) in maasers" :key="index">
                <td>{{ maaser.description }}</td>
                <td>{{ maaser.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
                <td>{{ maaser.date.toDate().toLocaleDateString() }}</td>
                <td><a @click="handleDeleteMaaser(maaser.id)">Delete</a></td>
              </tr>
            </tbody>
          </table>
        </figure>
      </details>
    </article>
  </main>
</template>

<style scoped>
  a {
    cursor: pointer;
  }
</style>