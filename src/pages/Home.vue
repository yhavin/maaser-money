<script setup>
  import { ref, computed, onMounted } from "vue"
  import { db, auth } from "../firebase.config.js"
  import { collection, addDoc, getDoc, getDocs, query, where, orderBy, doc, deleteDoc } from "firebase/firestore"
  import { signOut } from "firebase/auth"
  import { useRouter } from "vue-router"
  import IncomeForm from "../components/IncomeForm.vue"
  import DeductionForm from "../components/DeductionForm.vue"
  import MaaserForm from "../components/MaaserForm.vue"
  import Balance from "../components/Balance.vue"
  import TransactionsTable from "../components/TransactionsTable.vue"
  import IncomeDetail from "../components/IncomeDetail.vue"
  import DeductionDetail from "../components/DeductionDetail.vue"
  import MaaserDetail from "../components/MaaserDetail.vue"
  import AddToHomeScreen from "../components/AddToHomeScreen.vue"


  onMounted(() => {
    fetchUserInfo()
    fetchIncome()
    fetchDeductions()
    fetchMaaser()
  })
  
  const router = useRouter()

  const logout = () => {
    signOut(auth)
    router.push("/auth")
  }
  
  const incomeCollectionRef = collection(db, "income")
  const deductionCollectionRef = collection(db, "deductions")
  const maaserCollectionRef = collection(db, "maaser")
  const userCollectionRef = collection(db, "users")

  const userId = auth.currentUser.uid
  const userInfo = ref(null)
  const userLanguage = ref()
  const userCurrency = ref()

  const fetchUserInfo = async () => {
    const querySnapshot = await getDocs(
      query(userCollectionRef, where("uid", "==", userId))
    )
    userInfo.value = querySnapshot.docs[0].data()
    userLanguage.value = currencyLanguages[userInfo.value.currency]
    userCurrency.value = userInfo.value.currency
  }

  const currencyLanguages = {
    USD: "en-US",
    AUD: "en-AU",
    GBP: "en-GB",
    NIS: "he-IL",
    CAD: "en-CA",
    EUR: "fr-FR", // France used as European proxy
    MXN: "es-MX",
    NZD: "en-NZ",
    ZAR: "en-ZA"
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

  // Income
  const newIncome = ref({ description: "", amount: null, date: null, percent: "10%", currency: null, uid: null })
  const incomes = ref([])

  const incomeOpen = ref(false)

  const setIncomeOpen = () => {
    incomeOpen.value = true
  }

  const setIncomeClosed = () => {
    incomeOpen.value = false
    newIncome.value = { description: "", amount: null, date: null, percent: "10%", currency: null, uid: null }
    invalidIncomeDescription.value = null
    invalidIncomeAmount.value = null
  }

  const fetchIncome = async () => {
    const querySnapshot = await getDocs(
      query(incomeCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
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
      currency: userInfo.value.currency,
      uid: userId
    }
    if (validateIncome()) {
      const docRef = await addDoc(incomeCollectionRef, newIncome.value)
      console.log("Income added with ID:", docRef.id)
      setIncomeClosed()
      fetchIncome()
      newIncome.value = { description: "", amount: null, date: null, percent: "10%", currency: null, uid: null }
      invalidIncomeDescription.value = null
      invalidIncomeAmount.value = null
    } else {
      newIncome.value = { ...newIncome.value }
    }
  }

  const handleDeleteIncome = async (id) => {
    await deleteDoc(doc(incomeCollectionRef, id))
    fetchIncome()
    closeIncomeModal()
  }

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) =>  sum + income.amount, 0)
  })

  const selectedIncome = ref(null)
  const openIncomeModal = (income) => {
    selectedIncome.value = income
  }
  const closeIncomeModal = () => {
    selectedIncome.value = null
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

  // Deductions
  const newDeduction = ref({ description: "", amount: null, date: null, percent: "10%", currency: null, uid: null })
  const deductions = ref([])
  
  const deductionOpen = ref(false)

  const setDeductionOpen = () => {
    deductionOpen.value = true
  }

  const setDeductionClosed = () => {
    deductionOpen.value = false
    newDeduction.value = { description: "", amount: null, date: null, percent: "10%", currency: null, uid: null }
    invalidDeductionDescription.value = null
    invalidDeductionAmount.value = null
  }

  const fetchDeductions = async () => {
    const querySnapshot = await getDocs(
      query(deductionCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
    )
    const fetchedDeductions = []
    querySnapshot.forEach((doc) => {
      fetchedDeductions.push({ id: doc.id, ...doc.data() })
    })
    deductions.value = fetchedDeductions
  }

  const handleSubmitDeduction = async () => {
    newDeduction.value = { 
      description: newDeduction.value.description, 
      amount: newDeduction.value.amount,
      date: new Date(),
      percent: formatPercent(newDeduction.value.percent),
      currency: userInfo.value.currency,
      uid: userId
    }
    if (validateDeduction()) {
      const docRef = await addDoc(deductionCollectionRef, newDeduction.value)
      console.log("Deduction added with ID:", docRef.id)
      setDeductionClosed()
      fetchDeductions()
      newDeduction.value = { description: "", amount: null, date: null, percent: "10%", currency: null, uid: null }
      invalidDeductionDescription.value = null
      invalidDeductionAmount.value = null
    } else {
      newDeduction.value = { ...newDeduction.value }
    }
  }

  const handleDeleteDeduction = async (id) => {
    await deleteDoc(doc(deductionCollectionRef, id))
    fetchDeductions()
    closeDeductionModal()
  }

  const totalDeductions = computed(() => {
    return deductions.value.reduce((sum, deduction) =>  sum + deduction.amount, 0)
  })

  const selectedDeduction = ref(null)
  const openDeductionModal = (deduction) => {
    selectedDeduction.value = deduction
  }
  const closeDeductionModal = () => {
    selectedDeduction.value = null
  }

  const invalidDeductionDescription = ref()
  const invalidDeductionAmount = ref()
  const invalidDeductionPercent = ref()

  const validateDeduction = () => {
    invalidDeductionDescription.value = newDeduction.value.description === null || newDeduction.value.description.trim() === ""
    invalidDeductionAmount.value = newDeduction.value.amount === null || typeof newDeduction.value.amount !== "number"
    const regex = /^[^\d]/
    invalidDeductionPercent.value = newDeduction.value.percent === null || regex.test(newDeduction.value.percent)
    return !invalidDeductionDescription.value && !invalidDeductionAmount.value
  }

  // Ma'aser
  const newMaaser = ref({ description: "", amount: null, date: null, taxDeductible: false, currency: null, uid: null })
  const maasers = ref([])
  
  const fetchMaaser = async () => {
    const querySnapshot = await getDocs(
      query(maaserCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
    )
    const fetchedMaasers = []
    querySnapshot.forEach((doc) => {
      fetchedMaasers.push({ id: doc.id, ...doc.data() })
    })
    maasers.value = fetchedMaasers
  }

  const maaserOpen = ref(false)
  const setMaaserOpen = () => maaserOpen.value= true
  const setMaaserClosed = () => {
    maaserOpen.value = false
    newMaaser.value = { description: "", amount: null, date: null, taxDeductible: false, currency: null, uid: null }
    invalidMaaserDescription.value = null
    invalidMaaserAmount.value = null
  }

  const handleSubmitMaaser = async () => {
    newMaaser.value = { 
      description: newMaaser.value.description, 
      amount: newMaaser.value.amount,
      date: new Date(),
      taxDeductible: newMaaser.value.taxDeductible,
      currency: userInfo.value.currency,
      uid: userId
    }
    if (validateMaaser()) {
      const docRef = await addDoc(maaserCollectionRef, newMaaser.value)
      console.log("Ma'aser added with ID:", docRef.id)
      setMaaserClosed()
      fetchMaaser()
      newMaaser.value = { description: "", amount: null, date: null, taxDeductible: false, currency: null, uid: null }
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

    let owingDeducted = 0
    deductions.value.forEach((deduction) => {
      owingDeducted += (deduction.amount * deduction.percent)
    })
    return owing - owingDeducted - totalMaaser.value
  })

  const selectedMaaser = ref(null)
  const openMaaserModal = (maaser) => {
    selectedMaaser.value = maaser
  }
  const closeMaaserModal = () => {
    selectedMaaser.value = null
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
        <li><a @click="logout">Logout</a></li>
      </ul>
    </nav>
    <hgroup>
        <h1 class="title">Track your ma'aser</h1>
        <h3 class="title">Earn responsibly</h3>
      </hgroup>
    <article>
      <div class="grid">
        <button @click="setIncomeOpen">Add income</button>
        <button @click="setDeductionOpen">Add deduction</button>
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

    <DeductionForm
      :newDeduction="newDeduction"
      :deductionOpen="deductionOpen"
      :invalidDeductionDescription="invalidDeductionDescription"
      :invalidDeductionAmount="invalidDeductionAmount"
      :invalidDeductionPercent="invalidDeductionPercent"
      @setDeductionClosed="setDeductionClosed"
      @handleSubmitDeduction="handleSubmitDeduction"
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
      :userInfo="userInfo"
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :totalIncome="totalIncome"
      :totalDeductions="totalDeductions"
      :totalMaaser="totalMaaser"
      :maaserDue="maaserDue"
      :totalTaxDeductible="totalTaxDeductible"
    />

    <IncomeDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedIncome="selectedIncome"
      @closeIncomeModal="closeIncomeModal"
      @handleDeleteIncome="handleDeleteIncome"
    />

    <DeductionDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedDeduction="selectedDeduction"
      @closeDeductionModal="closeDeductionModal"
      @handleDeleteDeduction="handleDeleteDeduction"
    />

    <MaaserDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedMaaser="selectedMaaser"
      @closeMaaserModal="closeMaaserModal"
      @handleDeleteMaaser="handleDeleteMaaser"
    />

    <TransactionsTable
      :userInfo="userInfo"
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :incomes="incomes"
      :deductions="deductions"
      :maasers="maasers"
      @openIncomeModal="openIncomeModal"
      @openDeductionModal="openDeductionModal"
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