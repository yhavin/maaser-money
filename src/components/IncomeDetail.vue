<script setup>
  const props = defineProps({
    selectedIncome: Object
  })

  const emits = defineEmits(["closeIncomeModal", "handleDeleteIncome"])

  const emitCloseIncomeModal = () => {
    emits("closeIncomeModal")
  }

  const handleDeleteIncome = (id) => {
    emits("handleDeleteIncome", id)
  }
</script>

<template>
  <dialog :open="selectedIncome" v-if="selectedIncome">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="closeIncomeModal"></a>
        Income
      </header>
      <table>
        <tr>
          <th>Description</th>
          <td>{{ selectedIncome.description }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedIncome.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
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
          <td>{{ (selectedIncome.amount * selectedIncome.percent).toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
        </tr>
      </table>
      <footer>
        <a role="button" href="#" class="secondary" @click.prevent="handleDeleteIncome(selectedIncome.id)">Delete</a>
        <a role="button" href="#" @click.prevent="closeIncomeModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>

</style>