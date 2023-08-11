<script setup>
  import { currencyOptions } from '../utils/constants'
  import { recurringFrequencies } from '../utils/constants'
  import { weekDays } from "../utils/constants"
  import { monthDays } from "../utils/constants"

  
  const props = defineProps({
    newIncome: Object,
    newSchedule: Object,
    incomeOpen: Boolean,
    userCurrency: String,
    invalidIncomeDescription: Boolean,
    invalidIncomeAmount: Boolean,
    invalidIncomePercent: Boolean,
    isLoadingButton: Boolean
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
      <header>{{ newIncome.description || "Income" }}</header>
      <form>
        <input v-model="newIncome.description" placeholder="Description" :aria-invalid="invalidIncomeDescription">
        <input v-model.number="newIncome.amount" placeholder="Amount" :aria-invalid="invalidIncomeAmount">
        <label>
          <input type="checkbox" v-model="newIncome.conversion">
          Convert currency
        </label>
        <select v-if="newIncome.conversion" v-model="newIncome.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index :disabled="currency === userCurrency">{{ currency }}</option>
        </select>
        <input v-model="newIncome.percent" placeholder="%" :aria-invalid="invalidIncomePercent">
        <small>How much ma'aser do you want to contribute for this income?</small>
        <label>
          <input type="checkbox" v-model="newIncome.recurring">
          Recurring
        </label>
        <input v-if="newIncome.recurring" v-model="newSchedule.name" placeholder="Schedule name">
        <div class="grid">
          <select v-if="newIncome.recurring" v-model="newSchedule.frequency">
            <option v-for="(frequency, index) in recurringFrequencies" :key="index" :value="frequency.name" placeholder="Frequency">{{ frequency.label }}</option>
          </select>
          <select v-if="newIncome.recurring && newSchedule.frequency == 'week'" v-model="newSchedule.dayOfWeek">
            <option v-for="(day, index) in weekDays" :value="index + 1">{{ day }}</option>
          </select>
          <select v-if="newIncome.recurring && newSchedule.frequency == 'month'" v-model="newSchedule.dayOfMonth">
            <option v-for="(day, index) in monthDays" :value="index + 1">{{ day }}</option>
          </select>
        </div>
        <label v-if="newIncome.recurring && newSchedule.frequency">
          Repeat until
          <input v-if="newIncome.recurring && newSchedule.frequency" type="date" v-model="newSchedule.endDate">
          <small>Leave blank to repeat forever</small>
        </label>
      </form>
      <footer>
          <a role="button" href="#" class="secondary outline" @click.prevent="emitSetIncomeClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitIncome" :aria-busy="isLoadingButton">Save</a>
      </footer>
    </article>
  </dialog>
</template>