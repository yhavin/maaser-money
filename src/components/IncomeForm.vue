<script setup>
  import { currencyOptions } from '../assets/currencyOptions';


  const props = defineProps({
    newIncome: Object,
    incomeOpen: Boolean,
    invalidIncomeDescription: Boolean,
    invalidIncomeAmount: Boolean,
    invalidIncomePercent: Boolean
  })

  const emits = defineEmits(["setIncomeClosed", "handleSubmitIncome"])

  const emitSetIncomeClosed = () => {
    emits("setIncomeClosed")
  }

  const emitHandleSubmitIncome = () => {
    emits("handleSubmitIncome")
  }

</script>

<template>
  <dialog :open="incomeOpen">
    <article>
      <header>{{ newIncome.description || "Add income" }}</header>
      <form>
        <input v-model="newIncome.description" placeholder="Description" :aria-invalid="invalidIncomeDescription">
        <input v-model.number="newIncome.amount" placeholder="Amount" :aria-invalid="invalidIncomeAmount">
        <input v-model="newIncome.date" type="date">
        <label>
          <input type="checkbox" v-model="newIncome.conversion">
          Convert currency
        </label>
        <select v-if="newIncome.conversion" v-model="newIncome.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index>{{ currency }}</option>
        </select>
        <input v-model="newIncome.percent" placeholder="%" :aria-invalid="invalidIncomePercent">
        <small>How much ma'aser do you want to contribute for this income?</small>
      </form>
      <footer>
          <a role="button" href="#" class="secondary" @click.prevent="emitSetIncomeClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitIncome">Add income</a>
      </footer>
    </article>
  </dialog>
</template>