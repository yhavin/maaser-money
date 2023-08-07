<script setup>
  const props = defineProps({
    userInfo: Object,
    userLanguage: String,
    userCurrency: String,
    totalIncome: Number,
    totalDeductions: Number,
    totalMaaser: Number, 
    maaserDue: Number, 
    totalTaxDeductible: Number
  })

  const emits = defineEmits(["scrollToTarget"])

  const emitScrollToTarget = () => {
    emits("scrollToTarget")
  }
</script>

<template>
  <article v-if="!!userLanguage">
    <h3>Balance</h3>
    <table>
      <tr>
        <th>Income</th>
        <td>{{ totalIncome.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
      </tr>
      <tr>
        <th>Deductions</th>
        <td>{{ totalDeductions.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
      </tr>
      <tr>
        <th>Donations</th>
        <td>{{ totalMaaser.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
      </tr>
      <tfoot>
        <tr>
          <th><strong>Ma'aser due</strong></th>
          <td><strong>{{ maaserDue.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</strong></td>
        </tr>
      </tfoot>
    </table>
    <!-- <a @click="emitScrollToTarget">Where should I donate?</a> -->
    <!-- <small>Tax deductible donations: {{ totalTaxDeductible.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</small> -->
  </article>
</template>

<style scoped>
  article {
    margin-top: 0px;
  }

  td {
    text-align: right;
  }

  a {
    cursor: pointer;
  }
</style>