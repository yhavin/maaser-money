<script setup> 
  import { ref, computed } from "vue"
  import { Parser } from "@json2csv/plainjs"
  import FooterActions from './FooterActions.vue'


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
        <input type="search" placeholder="Amount" v-model="incomeAmountQuery">
      </div>
      <table>
        <tr v-if="filteredIncomes.length > 0" class="hover-underline" v-for="income in filteredIncomes" :key="income.id" @click="emitOpenIncomeModal(income)">
          <td>
            <strong>{{ income.description }}</strong><br />
            {{ income.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
            {{ income.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }} &nbsp; &nbsp; &nbsp; 
            {{ (income.percent * 100).toFixed(0) + "%" }}
          </td>
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
        <input type="search" placeholder="Amount" v-model="deductionAmountQuery">
      </div>
      <table>
        <tr v-if="filteredDeductions.length > 0" class="hover-underline" v-for="deduction in filteredDeductions" :key="deduction.id" @click="emitOpenDeductionModal(deduction)">
          <td>
            <strong>{{ deduction.description }}</strong><br />
            {{ deduction.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
            {{ deduction.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }} &nbsp; &nbsp; &nbsp; 
            {{ (deduction.percent * 100).toFixed(0) + "%" }}
          </td>
        </tr>
        <tr v-else>
          <td>No matches found.</td>
        </tr>
      </table>
    </details>

    <details>
      <summary>Ma'aser</summary>
      <a v-if="maasers.length" @click="exportMaaserToCsv">&#x2193 Export</a>
      <p></p>
      <div class="grid">
        <input type="search" placeholder="Description" v-model="maaserDescriptionQuery">
        <input type="search" placeholder="Amount" v-model="maaserAmountQuery">
      </div>
      <table>
        <tr v-if="filteredMaasers.length > 0" class="hover-underline" v-for="maaser in filteredMaasers" :key="maaser.id" @click="emitOpenMaaserModal(maaser)">
          <td>
            <strong>{{ maaser.description }}</strong><br />
            {{ maaser.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
            {{ maaser.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }} 
            {{ maaser.taxDeductible ? "&nbsp; &nbsp; &nbsp;#deductible" : null}}
          </td>
        </tr>
        <tr v-else>
          <td>No matches found.</td>
        </tr>
      </table>
    </details>
    <br />
    <FooterActions />
  </article>
</template>

<style scoped>
  a, td {
    cursor: pointer;
  }
  
  .hover-underline:hover {
    text-decoration: underline;
  }

</style>