<script setup> 
  import { ref, computed } from "vue"
  import { Parser } from "@json2csv/plainjs"


  const props = defineProps({
    userInfo: Object,
    userLanguage: String,
    userCurrency: String,
    incomes: Array,
    deductions: Array,
    maasers: Array
  })

  const emits = defineEmits(["openIncomeModal", "openDeductionModal", "openMaaserModal"])

  const emitOpenIncomeModal = (income) => {
    emits("openIncomeModal", income)
  }

  const emitOpenDeductionModal = (income) => {
    emits("openDeductionModal", income)
  }

  const emitOpenMaaserModal = (maaser) => {
    emits("openMaaserModal", maaser)
  }

  const incomeDescriptionQuery = ref("")
  const incomeAmountQuery = ref("")

  const filteredIncomes = computed(() => {
    const description = incomeDescriptionQuery.value.toLowerCase().trim()
    const amount = incomeAmountQuery.value.trim()

    return props.incomes.filter((income) => {
      const descriptionMatch = description === "" || income.description.toLowerCase().includes(description)
      const amountMatch = amount === "" || income.amount === parseFloat(amount)
      return descriptionMatch && amountMatch
    })
  })

  const exportIncomeToCsv = () => {
    const parser = new Parser()
    const incomesForExport = filteredIncomes.value.map((income) => {
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

  const deductionDescriptionQuery = ref("")
  const deductionAmountQuery = ref("")

  const filteredDeductions = computed(() => {
    const description = deductionDescriptionQuery.value.toLowerCase().trim()
    const amount = deductionAmountQuery.value.trim()

    return props.deductions.filter((deduction) => {
      const descriptionMatch = description === "" || deduction.description.toLowerCase().includes(description)
      const amountMatch = amount === "" || deduction.amount === parseFloat(amount)
      return descriptionMatch && amountMatch
    })
  })

  const exportDeductionsToCsv = () => {
    const parser = new Parser()
    const deductionsForExport = filteredDeductions.value.map((deduction) => {
      return { ...deduction, date: deduction.date.toDate() }
    })
    const csv = parser.parse(deductionsForExport)
    console.log(csv)
    const csvBlob = new Blob([csv], { type: "text/csv" })
    const csvUrl = URL.createObjectURL(csvBlob)
    const link = document.createElement("a")
    link.href = csvUrl
    link.download = "deductions.csv"
    link.click()
  }

  const maaserDescriptionQuery = ref("")
  const maaserAmountQuery = ref("")

  const filteredMaasers = computed(() => {
    const description = maaserDescriptionQuery.value.toLowerCase().trim()
    const amount = maaserAmountQuery.value.trim()

    return props.maasers.filter((maaser) => {
      const descriptionMatch = description === "" || maaser.description.toLowerCase().includes(description)
      const amountMatch = amount === "" || maaser.amount === parseFloat(amount)
      return descriptionMatch && amountMatch
    })
  })

  const exportMaaserToCsv = () => {
    const parser = new Parser()
    const maasersForExport = filteredMaasers.value.map((maaser) => {
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

</script>

<template>
  <article v-if="!!userLanguage">
    <h3>Transactions</h3>
    <details>
      <summary>Income</summary>
      <a v-if="incomes.length" @click="exportIncomeToCsv">&#x2193 Export</a>
      <p></p>
      <div class="grid">
        <input type="search" placeholder="Description" v-model="incomeDescriptionQuery">
      </div>
      <table>
        <tr v-if="filteredIncomes.length > 0" class="hover-underline" v-for="income in filteredIncomes" :key="income.id" @click="emitOpenIncomeModal(income)">
          <td>{{ income.description }}</td>
          <td class="recurring-symbol">{{ income.recurring ? "&#128257;" : null }}</td>
          <td class="number-align">{{ income.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
          <td class="number-align">{{ income.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr v-else>
          <td>No matches found.</td>
        </tr>
      </table>
    </details>

    <details>
      <summary>Deductions</summary>
      <a v-if="deductions.length" @click="exportDeductionsToCsv">&#x2193 Export</a>
      <p></p>
      <div class="grid">
        <input type="search" placeholder="Description" v-model="deductionDescriptionQuery">
      </div>
      <table>
        <tr v-if="filteredDeductions.length > 0" class="hover-underline" v-for="deduction in filteredDeductions" :key="deduction.id" @click="emitOpenDeductionModal(deduction)">
          <td>{{ deduction.description }}</td>
          <td class="number-align">{{ deduction.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
          <td class="number-align">{{ deduction.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr v-else>
          <td>No matches found.</td>
        </tr>
      </table>
    </details>

    <details>
      <summary>Donations</summary>
      <a v-if="maasers.length" @click="exportMaaserToCsv">&#x2193 Export</a>
      <p></p>
      <div class="grid">
        <input type="search" placeholder="Description" v-model="maaserDescriptionQuery">
      </div>
      <table>
        <tr v-if="filteredMaasers.length > 0" class="hover-underline" v-for="maaser in filteredMaasers" :key="maaser.id" @click="emitOpenMaaserModal(maaser)">
          <td>{{ maaser.description }}</td>
          <td class="recurring-symbol">{{ maaser.recurring ? "&#128257;" : null }}</td>
          <td class="number-align">{{ maaser.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
          <td class="number-align">{{ maaser.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr v-else>
          <td>No matches found.</td>
        </tr>
      </table>
    </details>
  </article>
</template>

<style scoped>
  a, td {
    cursor: pointer;
  }
  
  @media (prefers-color-scheme:dark) {
    .hover-underline:hover, .hover-underline:active {
    /* text-decoration: underline; */
    background-color: #1f2f3c;
    }
  }

  @media (prefers-color-scheme:light) {
    .hover-underline:hover {
    /* text-decoration: underline; */
    background-color: #f2f9f8;
    }
  }

  .number-align {
    text-align: right;
  }

  @media (max-width: 767px) {
    .recurring-symbol {
      display: none;
    }
  }

</style>