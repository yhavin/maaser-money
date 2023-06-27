<script setup>
  import { ref, computed, onMounted } from "vue"
  import { db, auth } from "../firebase.config.js"
  import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore"
  import { signOut } from "firebase/auth"
  import { useRouter } from "vue-router"
  import { Parser } from "@json2csv/plainjs"
  import IncomeForm from "../components/IncomeForm.vue"
  import MaaserForm from "../components/MaaserForm.vue"
  import Balance from "../components/Balance.vue"
  import TransactionsTable from "../components/TransactionsTable.vue"
  import IncomeDetail from "../components/IncomeDetail.vue"
  import MaaserDetail from "../components/MaaserDetail.vue"
  import AddToHomeScreen from "../components/AddToHomeScreen.vue"


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

  const setIncomeOpen = () => {
    incomeOpen.value = true
  }

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
  const invalidIncomePercent = ref()
  const validateIncome = () => {
    invalidIncomeDescription.value = newIncome.value.description === null || newIncome.value.description.trim() === ""
    invalidIncomeAmount.value = newIncome.value.amount === null || typeof newIncome.value.amount !== "number"
    const regex = /^[^\d]/
    invalidIncomePercent.value = newIncome.value.percent === null || regex.test(newIncome.value.percent)
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
    <hgroup>
        <h1 class="title">Track your ma'aser</h1>
        <h3 class="title">Earn responsibly</h3>
      </hgroup>
    <article>
      <div class="grid">
        <button @click="setIncomeOpen">Add income</button>
        <button @click="setMaaserOpen">Add ma'aser</button>
      </div>
    </article>

    <IncomeForm 
      :newIncome="newIncome"
      :incomeOpen="incomeOpen"
      :invalidIncomeDescription="invalidIncomeDescription"
      :invalidIncomeAmount="invalidIncomeAmount"
      :invalidIncomePercent="invalidIncomePercent"
      @setIncomeClosed="setIncomeClosed"
      @handleSubmitIncome="handleSubmitIncome"
    />

    <MaaserForm
      :newMaaser="newMaaser"
      :maaserOpen="maaserOpen"
      :invalidMaaserDescription="invalidMaaserDescription"
      :invalidMaaserAmount="invalidMaaserAmount"
      @setMaaserClosed="setMaaserClosed"
      @handleSubmitMaaser="handleSubmitMaaser"
    />

    <Balance
      :totalIncome="totalIncome"
      :totalMaaser="totalMaaser"
      :maaserDue="maaserDue"
      :totalTaxDeductible="totalTaxDeductible"
    />

    <IncomeDetail
      :selectedIncome="selectedIncome"
      @closeIncomeModal="closeIncomeModal"
      @handleDeleteIncome="handleDeleteIncome"
    />

    <MaaserDetail
      :selectedMaaser="selectedMaaser"
      @closeMaaserModal="closeMaaserModal"
      @handleDeleteMaaser="handleDeleteMaaser"
    />

    <TransactionsTable
      :incomes="incomes"
      :maasers="maasers"
      @exportIncomeToCsv="exportIncomeToCsv"
      @openIncomeModal="openIncomeModal"
      @exportMaaserToCsv="exportMaaserToCsv"
      @openMaaserModal="openMaaserModal"
    />

    <AddToHomeScreen />
    
  </main>
</template>

<style scoped>
  a, td {
    cursor: pointer;
  }

  .title {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 767px) {
    .title {
      display: none;
    }
  }

</style>