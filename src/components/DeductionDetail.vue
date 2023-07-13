<script setup>
  const props = defineProps({
    userLanguage: String,
    userCurrency: String,
    selectedDeduction: Object,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["closeDeductionModal", "handleDeleteDeduction"])

  const emitCloseDeductionModal = () => {
    emits("closeDeductionModal")
  }

  const emitHandleDeleteDeduction = (id) => {
    emits("handleDeleteDeduction", id)
  }
</script>

<template>
  <dialog :open="selectedDeduction" v-if="selectedDeduction">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="emitCloseDeductionModal"></a>
        Deduction
      </header>
      <table>
        <tr>
          <th>Description</th>
          <td>{{ selectedDeduction.description }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedDeduction.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{{ selectedDeduction.date.toDate().toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }) }}</td>
        </tr>
        <tr>
          <th>Ma'aser percent</th>
          <td>{{ ((selectedDeduction.percent * 100).toFixed(0) + "%") }}</td>
        </tr>
        <tr>
          <th>Ma'aser deducted</th>
          <td>{{ (selectedDeduction.amount * selectedDeduction.percent).toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
      </table>
      <small v-if=selectedDeduction.conversion>Converted from {{ selectedDeduction.baseAmount.toLocaleString(userLanguage, { style: "currency", currency: selectedDeduction.baseCurrency}) }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteDeduction(selectedDeduction)" :aria-busy="isLoadingButton">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseDeductionModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>