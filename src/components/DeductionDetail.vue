<script setup>
  import { ReceiptPercentIcon } from "@heroicons/vue/24/outline"

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
        <span class="modal-header"><ReceiptPercentIcon class="modal-header-icon" />Deduction</span>
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
          <td>{{ selectedDeduction.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
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

<style scoped>
  .modal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .modal-header-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    position: relative;
    top: -3px;
  }
</style>