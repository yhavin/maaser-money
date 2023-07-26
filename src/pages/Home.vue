<script setup>
  import { ref, computed, onMounted, watch } from "vue"
  import { db, auth } from "../firebase.config.js"
  import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
  import { signOut } from "firebase/auth"
  import { useRouter } from "vue-router"
  import { currencyLanguages } from "../utils/constants"
  import { formatPercent, convertCurrency } from "../utils/functions.js"
  import { useCreateSchedule } from "../composables/recurring/useCreateSchedule.js"
  import { useRunRecurring } from "../composables/recurring/useRunRecurring.js"
  import IncomeForm from "../components/IncomeForm.vue"
  import DeductionForm from "../components/DeductionForm.vue"
  import MaaserForm from "../components/MaaserForm.vue"
  import Balance from "../components/Balance.vue"
  import TransactionsTable from "../components/TransactionsTable.vue"
  import IncomeDetail from "../components/IncomeDetail.vue"
  import DeductionDetail from "../components/DeductionDetail.vue"
  import MaaserDetail from "../components/MaaserDetail.vue"
  import SchedulesTable from "../components/SchedulesTable.vue"
  import ScheduleDetail from "../components/ScheduleDetail.vue"
  import AddToHomeScreen from "../components/AddToHomeScreen.vue"
  import FooterActions from "../components/FooterActions.vue"

  
  const isIOS = ref(false)
  const isSafari = ref(false)
  const isPWAInstalled = ref(false)
  
  onMounted(async () => {
    fetchUserInfo()
    // Only gets first new recurring item until refresh
    await useRunRecurring(userId, scheduleCollectionRef)
    fetchSchedules()
    fetchIncome()
    fetchDeductions()
    fetchMaaser()
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent)
    isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    isPWAInstalled.value = mediaQuery.matches
  })
  
  const router = useRouter()

  const logout = () => {
    signOut(auth)
    router.push("/auth")
  }
  
  const incomeCollectionRef = collection(db, "income")
  const deductionCollectionRef = collection(db, "deductions")
  const maaserCollectionRef = collection(db, "maaser")
  const scheduleCollectionRef = collection(db, "schedules")
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

  const isDropdownOpen = ref(false)

  const isLoadingButton = ref(false)

  watch(isLoadingButton, (newValue, oldValue) => {
    // Loading time get overriden by closing of form modal
    // The aria-busy loading wheel still shows for a small amount of time
    const loadingTime = 400
    if (newValue) {
      setTimeout(() => {
        isLoadingButton.value = false
      }, loadingTime)
    }
  })

  // Recurring
  const defaultSchedule = ({ endDate: null, frequency: null })
  const newSchedule = ref({ endDate: null, frequency: null })
  const schedules = ref()

  const fetchSchedules = async () => {
    const querySnapshot = await getDocs(
      query(scheduleCollectionRef, where("uid", "==", userId), where("active", "==", true), orderBy("startDate", "desc"))
    )
    const fetchedSchedules = []
    querySnapshot.forEach((doc) => {
      fetchedSchedules.push({ id: doc.id, ...doc.data() })
    })
    schedules.value = fetchedSchedules
  }

  const handleDeleteSchedule = async (schedule) => {
    isLoadingButton.value = true
    const scheduleRef = doc(scheduleCollectionRef, schedule.id)
    await updateDoc(scheduleRef, { active: false })
    fetchSchedules()
    closeScheduleModal()
  }

  const selectedSchedule = ref(null)
  const openScheduleModal = (schedule) => {
    selectedSchedule.value = schedule
  }
  const closeScheduleModal = () => {
    selectedSchedule.value = null
  }

  // Income
  const defaultIncome = { description: "", amount: null, date: null, percent: "10%", currency: null, conversion: false, baseCurrency: null, baseAmount: null, recurring: false, scheduleId: null, uid: null }
  const newIncome = ref({ description: "", amount: null, date: null, percent: "10%", currency: null, conversion: false, baseCurrency: null, baseAmount: null, recurring: false, scheduleId: null, uid: null })
  const incomes = ref([])

  const incomeOpen = ref(false)

  const setIncomeOpen = () => {
    incomeOpen.value = true
    isDropdownOpen.value = false
  }

  const setIncomeClosed = () => {
    incomeOpen.value = false
    newIncome.value = { ... defaultIncome }
    newSchedule.value = { ...defaultSchedule }
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
    let amount
    if (newIncome.value.conversion) {
      amount = await convertCurrency(newIncome.value.amount, newIncome.value.baseCurrency, userCurrency.value)
    } else {
      amount = newIncome.value.amount
    }
    newIncome.value = { 
      description: newIncome.value.description, 
      amount: amount,
      date: new Date(),
      percent: formatPercent(newIncome.value.percent),
      currency: userInfo.value.currency,
      conversion: newIncome.value.conversion,
      baseCurrency: newIncome.value.conversion ? newIncome.value.baseCurrency : userCurrency.value,
      baseAmount: newIncome.value.amount,
      recurring: newIncome.value.recurring,
      frequency: null,
      scheduleId: null,
      uid: userId
    }
    if (validateIncome()) {
      isLoadingButton.value = true
      if (newIncome.value.recurring) {
        await useCreateSchedule("income", newIncome, userId, defaultSchedule, newSchedule, scheduleCollectionRef)
      } else {
        const docRef = await addDoc(incomeCollectionRef, newIncome.value)
        console.log("Income added with ID:", docRef.id)
      }
      setIncomeClosed()
      await fetchIncome()
      await fetchSchedules()
      newIncome.value = { ...defaultIncome }
      invalidIncomeDescription.value = null
      invalidIncomeAmount.value = null
      invalidIncomePercent.value = null
    } else {
      newIncome.value = { ...defaultIncome }
    }
  }

  const handleDeleteIncome = async (income) => {
    isLoadingButton.value = true
    const scheduleRef = income.scheduleId ? doc(scheduleCollectionRef, income.scheduleId) : null
    await deleteDoc(doc(incomeCollectionRef, income.id))
    if (scheduleRef) {
      await updateDoc(scheduleRef, { itemIds: arrayRemove(income.id) })
    }
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
  const defaultDeduction = { description: "", amount: null, date: null, percent: "10%", currency: null, conversion: false, baseCurrency: null, baseAmount: null, uid: null }
  const newDeduction = ref({ description: "", amount: null, date: null, percent: "10%", currency: null, conversion: false, baseCurrency: null, baseAmount: null, uid: null })
  const deductions = ref([])
  
  const deductionOpen = ref(false)

  const setDeductionOpen = () => {
    deductionOpen.value = true
    isDropdownOpen.value = false
  }

  const setDeductionClosed = () => {
    deductionOpen.value = false
    newDeduction.value = { ...defaultDeduction }
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
    let amount
    if (newDeduction.value.conversion) {
      amount = await convertCurrency(newDeduction.value.amount, newDeduction.value.baseCurrency, userCurrency.value)
    } else {
      amount = newDeduction.value.amount
    }
    newDeduction.value = { 
      description: newDeduction.value.description, 
      amount: amount,
      date: new Date(),
      percent: formatPercent(newDeduction.value.percent),
      currency: userInfo.value.currency,
      conversion: newDeduction.value.conversion,
      baseCurrency: newDeduction.value.conversion ? newDeduction.value.baseCurrency : userCurrency.value,
      baseAmount: newDeduction.value.amount,
      uid: userId
    }
    if (validateDeduction()) {
      isLoadingButton.value = true
      const docRef = await addDoc(deductionCollectionRef, newDeduction.value)
      console.log("Deduction added with ID:", docRef.id)
      setDeductionClosed()
      fetchDeductions()
      newDeduction.value = { ...defaultDeduction }
      invalidDeductionDescription.value = null
      invalidDeductionAmount.value = null
      invalidDeductionPercent.value = null
    } else {
      newDeduction.value = { ...defaultDeduction }
    }
  }

  const handleDeleteDeduction = async (deduction) => {
    isLoadingButton.value = true
    await deleteDoc(doc(deductionCollectionRef, deduction.id))
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
  const defaultMaaser = { description: "", amount: null, date: null, taxDeductible: false, currency: null, conversion: false, baseCurrency: null, baseAmount: null, uid: null }
  const newMaaser = ref({ description: "", amount: null, date: null, taxDeductible: false, currency: null, conversion: false, baseCurrency: null, baseAmount: null, uid: null })
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

  const setMaaserOpen = () => {
    maaserOpen.value = true
    isDropdownOpen.value = false
  }

  const setMaaserClosed = () => {
    maaserOpen.value = false
    newMaaser.value = { ...defaultMaaser }
    invalidMaaserDescription.value = null
    invalidMaaserAmount.value = null
  }

  const handleSubmitMaaser = async () => {
    let amount
    if (newMaaser.value.conversion) {
      amount = await convertCurrency(newMaaser.value.amount, newMaaser.value.baseCurrency, userCurrency.value)
    } else {
      amount = newMaaser.value.amount
    }
    newMaaser.value = { 
      description: newMaaser.value.description, 
      amount: amount,
      date: new Date(),
      taxDeductible: newMaaser.value.taxDeductible,
      currency: userInfo.value.currency,
      conversion: newMaaser.value.conversion,
      baseCurrency: newMaaser.value.conversion ? newMaaser.value.baseCurrency : userCurrency.value,
      baseAmount: newMaaser.value.amount,
      uid: userId
    }
    if (validateMaaser()) {
      isLoadingButton.value = true
      const docRef = await addDoc(maaserCollectionRef, newMaaser.value)
      console.log("Ma'aser added with ID:", docRef.id)
      setMaaserClosed()
      fetchMaaser()
      newMaaser.value = { ...defaultMaaser }
      invalidMaaserDescription.value = null
      invalidMaaserAmount.value = null
    } else {
      newMaaser.value = { ...defaultMaaser }
    }
  }

  const handleDeleteMaaser = async (maaser) => {
    isLoadingButton.value = true
    await deleteDoc(doc(maaserCollectionRef, maaser.id))
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

  const scrollToHere = ref()
  const scrollToTarget = () => {
    scrollToHere.value.scrollIntoView({ behavior: "smooth" })
  }

</script>

<template>
  <nav class="container">
    <ul>
      <li class="nav-logo-desktop">
        <img href="#" src="/img/icons/logo-circle.png">
      </li>
      <li>
        <details role="list">
          <summary aria-haspopup="listbox" role="link">{{ auth.currentUser.email }}</summary>
          <ul role="listbox">
            <li><button class="secondary outline list" @click="logout">&#8594; Log out</button></li>
          </ul>
        </details>
      </li>
    </ul>
    <ul>
      <li dir="rtl">
        <details role="list">
          <summary aria-haspopup="listbox" role="button" @click="isDropdownOpen = true">&#65291;</summary>
          <ul role="listbox" v-show="isDropdownOpen">
            <li><button class="secondary outline list" @click="setIncomeOpen"> Income &#65291;</button></li>
            <li><button class="secondary outline list" @click="setDeductionOpen">Deduction &#65291;</button></li>
            <li><button class="secondary outline list" @click="setMaaserOpen">Donation &#65291;</button></li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
  <main class="container">

    <IncomeForm 
      :newIncome="newIncome"
      :newSchedule="newSchedule"
      :incomeOpen="incomeOpen"
      :userCurrency="userCurrency"
      :invalidIncomeDescription="invalidIncomeDescription"
      :invalidIncomeAmount="invalidIncomeAmount"
      :invalidIncomePercent="invalidIncomePercent"
      :isLoadingButton="isLoadingButton"
      @setIncomeClosed="setIncomeClosed"
      @handleSubmitIncome="handleSubmitIncome"
    />

    <DeductionForm
      :newDeduction="newDeduction"
      :deductionOpen="deductionOpen"
      :userCurrency="userCurrency"
      :invalidDeductionDescription="invalidDeductionDescription"
      :invalidDeductionAmount="invalidDeductionAmount"
      :invalidDeductionPercent="invalidDeductionPercent"
      :isLoadingButton="isLoadingButton"
      @setDeductionClosed="setDeductionClosed"
      @handleSubmitDeduction="handleSubmitDeduction"
    />

    <MaaserForm
      :newMaaser="newMaaser"
      :maaserOpen="maaserOpen"
      :userCurrency="userCurrency"
      :invalidMaaserDescription="invalidMaaserDescription"
      :invalidMaaserAmount="invalidMaaserAmount"
      :isLoadingButton="isLoadingButton"
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
      @scrollToTarget="scrollToTarget"
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

    <IncomeDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedIncome="selectedIncome"
      :isLoadingButton="isLoadingButton"
      @closeIncomeModal="closeIncomeModal"
      @handleDeleteIncome="handleDeleteIncome"
    />

    <DeductionDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedDeduction="selectedDeduction"
      :isLoadingButton="isLoadingButton"
      @closeDeductionModal="closeDeductionModal"
      @handleDeleteDeduction="handleDeleteDeduction"
    />

    <MaaserDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedMaaser="selectedMaaser"
      :isLoadingButton="isLoadingButton"
      @closeMaaserModal="closeMaaserModal"
      @handleDeleteMaaser="handleDeleteMaaser"
    />

    <div v-if="schedules?.length > 0">
      <SchedulesTable
        :userInfo="userInfo"
        :userLanguage="userLanguage"
        :userCurrency="userCurrency"
        :schedules="schedules"
        @openScheduleModal="openScheduleModal"
      />
    </div>

    <ScheduleDetail
      :userLanguage="userLanguage"
      :userCurrency="userCurrency"
      :selectedSchedule="selectedSchedule"
      :isLoadingButton="isLoadingButton"
      @closeScheduleModal="closeScheduleModal"
      @handleDeleteSchedule="handleDeleteSchedule"
    />

    <div ref="scrollToHere">
      <article>
        <h3>Partners <sup><small>(Beta)</small></sup></h3>
        <article>
          <header class="partner-header">
            <img src="/img/swarthmore-chabad.png" width="315">
          </header>
          <h5 class="partner-card">Swarthmore Chabad</h5>
          <small>
            <strong>Kickstarter Campaign</strong>
            <br />
            Fostering a creative and engaging Jewish space at Swarthmore College for tomorrow's leaders.
          </small>
          <footer class="partner-footer">
            <a role="button" href="https://charidy.com/swarthmorechabad?utm_source=maaser.money" target="_blank">Donate</a>
          </footer>
        </article>
      </article>
    </div>

    <div v-if="!isPWAInstalled && isIOS && isSafari">
      <AddToHomeScreen />
    </div>

    <FooterActions />
    <br />
    <img href="#" src="/img/icons/logo-circle.png" class="footer-logo">
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
    .title-group {
      display: none;
    }
  }

  .list {
    border: none;
    text-align: left;
  }

  details {
    margin: 0px!important
  }

  @media (prefers-color-scheme: dark) {
    .secondary {
      color: white;
    }

    .secondary:hover {
      background-color: #2a3e4e;
      color: white;
    }
  }

  .nav-logo-desktop {
    width: 20%;
    height: auto;
    display: block;
    margin-left: 3%;
    margin-right: 2%;
    padding-left: 0px;
  }

@media (max-width: 767px) {
  .nav-logo-desktop {
    display: none;
  }
}

.footer-logo {
  display: block;
  width: 7%;
  height: auto;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 767px) {
  .footer-logo {
    width: 20%;
  }
}

.partner-header {
  margin-bottom: 12px;
}

@media (max-width: 767px) {
  .partner-header {
    padding: 0px;
  }
}
.partner-card {
  margin-bottom: 0px;
}

.partner-footer {
  margin-top: 12px;
}

</style>