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
</script>

<template>
  <article v-if="!!userLanguage">
    <h3>Balance</h3>
    <table>
      <tr>
        <th>Total income</th>
        <td>{{ totalIncome.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
      </tr>
      <tr>
        <th>Total deductions</th>
        <td>{{ totalDeductions.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
      </tr>
      <tr>
        <th>Total ma'aser</th>
        <td>{{ totalMaaser.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }} *</td>
      </tr>
      <tfoot>
        <tr>
          <th><strong>Ma'aser due</strong></th>
          <td><strong>{{ maaserDue.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</strong></td>
        </tr>
      </tfoot>
    </table>
    <small>* Total tax deductible: {{ totalTaxDeductible.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</small>
  </article>
</template>