<script setup>
  const props = defineProps({
    incomes: Array,
    maasers: Array
  })

  const emits = defineEmits(["exportIncomeToCsv", "openIncomeModal", "exportMaaserToCsv", "openMaaserModal"])

  const emitExportIncomeToCsv = () => {
    emits("exportIncomeToCsv")
  }

  const emitOpenIncomeModal = (income) => {
    emits("openIncomeModal", income)
  }

  const emitExportMaaserToCsv = () => {
    emits("exportMaaserToCsv")
  }

  const emitOpenMaaserModal = (maaser) => {
    emits("openMaaserModal", maaser)
  }

</script>

<template>
  <article>
    <h3>Transactions</h3>
    <details open>
      <summary>Income</summary>
      <a v-if="incomes.length" @click="emitExportIncomeToCsv">&#x2193 Export</a>
      <p></p>
      <table>
        <tr class="hover-underline" v-for="income in incomes" :key="income.id" @click="emitOpenIncomeModal(income)">
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
      <a v-if="maasers.length" @click="emitExportMaaserToCsv">&#x2193 Export</a>
      <p></p>
      <table>
        <tr class="hover-underline" v-for="maaser in maasers" :key="maaser.id" @click="emitOpenMaaserModal(maaser)">
          <td>
            <strong>{{ maaser.description }}</strong><br />
            {{ maaser.date.toDate().toLocaleDateString() }} &nbsp; &nbsp; &nbsp; 
            {{ maaser.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }} &nbsp; &nbsp; &nbsp; 
            {{ maaser.taxDeductible ? "#deductible" : null}}
          </td>
        </tr>
      </table>
    </details>
    <br />
    <span class="gutter-text">Feedback and suggestions welcome by&nbsp;<a href="mailto:y.havin@gmail.com?subject=Ma%27aser%20app%20feedback">email</a></span>
  </article>
</template>

<style scoped>
  .hover-underline:hover {
    text-decoration: underline;
  }

  .gutter-text {
    font-size: 13px;
    display: flex;
    justify-content: center;
  }
</style>