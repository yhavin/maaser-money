<script setup>
  import { currencyOptions } from '../utils/constants'
  import { ReceiptPercentIcon } from "@heroicons/vue/24/outline"


  const props = defineProps({
    newDeduction: Object,
    deductionOpen: Boolean,
    userCurrency: String,
    invalidDeductionDescription: Boolean,
    invalidDeductionAmount: Boolean,
    invalidDeductionPercent: Boolean,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["setDeductionClosed", "handleSubmitDeduction"])

  const emitSetDeductionClosed = () => {
    emits("setDeductionClosed")
  }

  const emitHandleSubmitDeduction = () => {
    emits("handleSubmitDeduction")
  }

</script>

<template>
  <dialog :open="deductionOpen">
    <article>
      <header class="modal-header"><ReceiptPercentIcon class="modal-header-icon" />{{ newDeduction.description || "Deduction" }}</header>
      <form>
        <input v-model="newDeduction.description" placeholder="Description" :aria-invalid="invalidDeductionDescription">
        <small>Deductions are things like business expenses that lower how much income you need to pay ma'aser on</small>
        <input v-model.number="newDeduction.amount" placeholder="Amount" :aria-invalid="invalidDeductionAmount">
        <label>
          <input type="checkbox" v-model="newDeduction.conversion">
          Convert currency
        </label>
        <select v-if="newDeduction.conversion" v-model="newDeduction.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index :disabled="currency === userCurrency">{{ currency }}</option>
        </select>
        <input v-model="newDeduction.percent" placeholder="%" :aria-invalid="invalidDeductionPercent">
        <small>How much ma'aser do you want to remove for this deduction?</small>
      </form>
      <footer>
          <a role="button" href="#" class="secondary outline" @click.prevent="emitSetDeductionClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitDeduction" :aria-busy="isLoadingButton">Save</a>
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
  }

  @media (prefers-color-scheme: dark) {
    .modal-header-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
</style>