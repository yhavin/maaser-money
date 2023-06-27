<script setup>
  const props = defineProps({
    totalIncome: Number,
    totalMaaser: Number, 
    maaserDue: Number, 
    totalTaxDeductible: Number
  })
</script>

<template>
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
</template>