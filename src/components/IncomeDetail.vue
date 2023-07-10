<script setup>
  const props = defineProps({
    userLanguage: String,
    userCurrency: String,
    selectedIncome: Object
  })

  const emits = defineEmits(["closeIncomeModal", "handleDeleteIncome"])

  const emitCloseIncomeModal = () => {
    emits("closeIncomeModal")
  }

  const emitHandleDeleteIncome = (id) => {
    emits("handleDeleteIncome", id)
  }
</script>

<template>
  <dialog :open="selectedIncome" v-if="selectedIncome">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="emitCloseIncomeModal"></a>
        Income
      </header>
      <table>
        <tr>
          <th>Description</th>
          <td>{{ selectedIncome.description }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedIncome.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
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
          <td>{{ (selectedIncome.amount * selectedIncome.percent).toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
        </tr>
      </table>
      <small v-if=selectedIncome.conversion>Converted from {{ selectedIncome.baseAmount }} {{ selectedIncome.baseCurrency }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteIncome(selectedIncome.id)">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseIncomeModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>