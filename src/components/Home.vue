<script setup>
  import { ref, computed, onMounted } from "vue"
  import { db, auth } from "../firebase.config.js"
  import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore"
  import { signOut } from "firebase/auth"
  import { useRouter } from "vue-router"
  import { Parser } from "@json2csv/plainjs"


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

  const incomeOpen = ref(false)
  const setIncomeOpen = () => incomeOpen.value = true
  const setIncomeClosed = () => {
    incomeOpen.value = false
    newIncome.value = { description: "", amount: null, date: null, percent: "10%", uid: null }
    invalidIncomeDescription.value = null
    invalidIncomeAmount.value = null
  }

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
    if (validateIncome()) {
      const docRef = await addDoc(incomeCollectionRef, newIncome.value)
      console.log("Income added with ID:", docRef.id)
      setIncomeClosed()
      fetchIncome()
      newIncome.value = { description: "", amount: null, date: null, percent: "10%", uid: null }
      invalidIncomeDescription.value = null
      invalidIncomeAmount.value = null
    } else {
      newIncome.value = { ...newIncome.value, percent: "10%" }
    }
  }

  const handleDeleteIncome = async (id) => {
    await deleteDoc(doc(incomeCollectionRef, id))
    fetchIncome()
    closeIncomeModal()
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

  const newMaaser = ref({ description: "", amount: null, date: null, taxDeductible: false, uid: null })
  const maasers = ref([])

  const maaserOpen = ref(false)
  const setMaaserOpen = () => maaserOpen.value= true
  const setMaaserClosed = () => {
    maaserOpen.value = false
    newMaaser.value = { description: "", amount: null, date: null, taxDeductible: false, uid: null }
    invalidMaaserDescription.value = null
    invalidMaaserAmount.value = null
  }

  const handleSubmitMaaser = async () => {
    newMaaser.value = { 
      description: newMaaser.value.description, 
      amount: newMaaser.value.amount,
      date: new Date(),
      taxDeductible: newMaaser.value.taxDeductible,
      uid: userId
    }
    if (validateMaaser()) {
      const docRef = await addDoc(maaserCollectionRef, newMaaser.value)
      console.log("Ma'aser added with ID:", docRef.id)
      setMaaserClosed()
      fetchMaaser()
      newMaaser.value = { description: "", amount: null, date: null, taxDeductible: false, uid: null }
      invalidMaaserDescription.value = null
      invalidMaaserAmount.value = null
    } else {
      newMaaser.value = { ...newMaaser.value }
    }
  }

  const handleDeleteMaaser = async (id) => {
    await deleteDoc(doc(maaserCollectionRef, id))
    fetchMaaser()
    closeMaaserModal()
  }

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) =>  sum + income.amount, 0)
  })

  const totalMaaser = computed(() => {
    return maasers.value.reduce((sum, maaser) =>  sum + maaser.amount, 0)
  })

  const totalTaxDeductible = computed(() => {
    const deductible = maasers.value.filter((maaser) => maaser.taxDeductible)
    return deductible.reduce((sum, maaser) => sum + maaser.amount, 0)
  })

  const maaserDue = computed(() => {
    let owing = 0
    incomes.value.forEach((income) => {
      owing += (income.amount * income.percent)
    })
    return owing - totalMaaser.value
  })

  const exportIncomeToCsv = () => {
    const parser = new Parser()
    const incomesForExport = incomes.value.map((income) => {
      return { ...income, date: income.date.toDate() }
    })
    const csv = parser.parse(incomesForExport)
    console.log(csv)
    const csvBlob = new Blob([csv], { type: "text/csv" })
    const csvUrl = URL.createObjectURL(csvBlob)
    const link = document.createElement("a")
    link.href = csvUrl
    link.download = "income.csv"
    link.click()
  }

  const exportMaaserToCsv = () => {
    const parser = new Parser()
    const maasersForExport = maasers.value.map((maaser) => {
      return { ...maaser, date: maaser.date.toDate() }
    })
    const csv = parser.parse(maasersForExport)
    console.log(csv)
    const csvBlob = new Blob([csv], { type: "text/csv" })
    const csvUrl = URL.createObjectURL(csvBlob)
    const link = document.createElement("a")
    link.href = csvUrl
    link.download = "maaser.csv"
    link.click()
  }

  const selectedIncome = ref(null)
  const openIncomeModal = (income) => {
    selectedIncome.value = income
  }
  const closeIncomeModal = () => {
    selectedIncome.value = null
  }

  const selectedMaaser = ref(null)
  const openMaaserModal = (maaser) => {
    selectedMaaser.value = maaser
  }
  const closeMaaserModal = () => {
    selectedMaaser.value = null
  }

  const invalidIncomeDescription = ref()
  const invalidIncomeAmount = ref()
  const validateIncome = () => {
    invalidIncomeDescription.value = newIncome.value.description === null || newIncome.value.description.trim() === ""
    invalidIncomeAmount.value = newIncome.value.amount === null || typeof newIncome.value.amount !== "number"
    return !invalidIncomeDescription.value && !invalidIncomeAmount.value
  }

  const invalidMaaserDescription = ref()
  const invalidMaaserAmount = ref()
  const validateMaaser = () => {
    invalidMaaserDescription.value = newMaaser.value.description === null || newMaaser.value.description.trim() === ""
    invalidMaaserAmount.value = newMaaser.value.amount === null || typeof newMaaser.value.amount !== "number"
    return !invalidMaaserDescription.value && !invalidMaaserAmount.value
  }

</script>

<template>
  <main class="container">
    <nav>
      <ul>
        <li>Logged in as {{ auth.currentUser.email }}</li>
      </ul>
      <ul>
        <li><a @click="logout" >Logout</a></li>
      </ul>
    </nav>
    <article>
      <div class="grid">
        <button @click="setIncomeOpen">Add income</button>
        <button @click="setMaaserOpen">Add ma'aser</button>
      </div>
    </article>

    <dialog :open="incomeOpen">
      <article>
        <header>Add income</header>
        <form>
          <input v-model="newIncome.description" placeholder="Description" :aria-invalid="invalidIncomeDescription">
          <input v-model.number="newIncome.amount" placeholder="Amount" :aria-invalid="invalidIncomeAmount">
          <select v-model="newIncome.percent">
            <option value="10%" selected>10%</option>
            <option value="15%">15%</option>
            <option value="20%">20%</option>
            <option value="25%">25%</option>
          </select>
        </form>
        <footer>
            <a role="button" href="#" class="secondary" @click.prevent="setIncomeClosed">Cancel</a>
            <a role="button" href="#" @click.prevent="handleSubmitIncome">Add income</a>
        </footer>
      </article>
    </dialog>

    <dialog :open="maaserOpen">
      <article>
        <header>Add ma'aser</header>
        <form @submit.prevent="handleSubmitMaaser">
          <input v-model="newMaaser.description" placeholder="Description" :aria-invalid="invalidMaaserDescription">
          <input v-model.number="newMaaser.amount" placeholder="Amount" :aria-invalid="invalidMaaserAmount">
          <label>
            <input type="checkbox" v-model="newMaaser.taxDeductible">
            Tax deductible
          </label>
        </form>
        <footer>
            <a role="button" href="#" class="secondary" @click.prevent="setMaaserClosed">Cancel</a>
            <a role="button" href="#" @click.prevent="handleSubmitMaaser">Add ma'aser</a>
        </footer>
      </article>
    </dialog>

    <article>
      <h3>Balance</h3>
      <table>
        <tr>
          <th>Total income</th>
          <td>{{ totalIncome.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
        </tr>
        <tr>
          <th>Total ma'aser</th>
          <td>{{ totalMaaser.toLocaleString("en-US", { style: "currency", currency: "USD" }) }} *</td>
        </tr>
        <tfoot>
          <tr>
            <th><strong>Ma'aser due</strong></th>
            <td><strong>{{ maaserDue.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</strong></td>
          </tr>
        </tfoot>
      </table>
      <small>* Total tax deductible: {{ totalTaxDeductible.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</small>
    </article>

    <dialog :open="selectedIncome" v-if="selectedIncome">
      <article>
        <header>
          <a href="#" class="close" @click.prevent="closeIncomeModal"></a>
          Income
        </header>
        <table>
          <tr>
            <th>Description</th>
            <td>{{ selectedIncome.description }}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{{ selectedIncome.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
          </tr>
          <tr>
            <th>Date</th>
            <td>{{ selectedIncome.date.toDate().toLocaleDateString() }}</td>
          </tr>
          <tr>
            <th>Ma'aser percent</th>
            <td>{{ ((selectedIncome.percent * 100).toFixed(0) + "%") }}</td>
          </tr>
          <tr>
            <th>Ma'aser owing</th>
            <td>{{ (selectedIncome.amount * selectedIncome.percent).toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
          </tr>
        </table>
        <footer>
          <a role="button" href="#" class="secondary" @click.prevent="handleDeleteIncome(selectedIncome.id)">Delete</a>
          <a role="button" href="#" @click.prevent="closeIncomeModal">Exit</a>
        </footer>
      </article>
    </dialog>

    <dialog :open="selectedMaaser" v-if="selectedMaaser">
      <article>
        <header>
          <a href="#" class="close" @click.prevent="closeMaaserModal"></a>
          Ma'aser
        </header>
        <table>
          <tr>
            <th>Description</th>
            <td>{{ selectedMaaser.description }}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{{ selectedMaaser.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
          </tr>
          <tr>
            <th>Date</th>
            <td>{{ selectedMaaser.date.toDate().toLocaleDateString() }}</td>
          </tr>
          <tr>
            <th>Tax deductible</th>
            <td><input type="checkbox" :checked="selectedMaaser.taxDeductible" disabled></td>
          </tr>
        </table>
        <footer>
          <a role="button" href="#" class="secondary" @click.prevent="handleDeleteMaaser(selectedMaaser.id)">Delete</a>
          <a role="button" href="#" @click.prevent="closeMaaserModal">Exit</a>
        </footer>
      </article>
    </dialog>

    <article>
      <h3>Transactions</h3>
      <details open>
        <summary>Income</summary>
        <a v-if="incomes.length" @click="exportIncomeToCsv">&#x2193 Export</a>
        <p></p>
        <table>
          <tr class="hover-underline" v-for="income in incomes" :key="income.id" @click="openIncomeModal(income)">
            <td>
              <strong>{{ income.description }}</strong><br />
              {{ income.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
              {{ income.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }} &nbsp; &nbsp; &nbsp; 
              {{ (income.percent * 100).toFixed(0) + "%" }}
            </td>
          </tr>
        </table>
      </details>

      <details open>
        <summary>Ma'aser</summary>
        <a v-if="maasers.length" @click="exportMaaserToCsv">&#x2193 Export</a>
        <p></p>
        <table>
          <tr class="hover-underline" v-for="maaser in maasers" :key="maaser.id" @click="openMaaserModal(maaser)">
            <td>
              <strong>{{ maaser.description }}</strong><br />
              {{ maaser.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
              {{ maaser.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }} &nbsp; &nbsp; &nbsp; 
              {{ maaser.taxDeductible ? "#deductible" : null}}
            </td>
          </tr>
        </table>
      </details>
    </article>
  </main>
</template>

<style scoped>
  a, td {
    cursor: pointer;
  }

  .hover-underline:hover {
    text-decoration: underline;
  }

</style>