<script setup>
  import { parse } from "dotenv"
  import { currencyOptions } from "../utils/constants"
  import { recurringFrequencies } from "../utils/constants"
  import { weekDays } from "../utils/constants"
  import { monthDays } from "../utils/constants"
  import { sanitiseAmount, debounce } from "../utils/functions"

  
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

  const onAmountInput = debounce((event, props) => {
    const amount = event.target.value
    // Ensure that backspaced input doesn't return "NaN"
    if (amount.trim() === "") {
      props.newIncome.amount = null
    } else {
      const sanitisedFloatAmount = parseFloat(sanitiseAmount(amount))
      console.log(sanitisedFloatAmount, typeof sanitisedFloatAmount)
      // Ensure that random characters don't get converted to NaN
      if (!isNaN(sanitisedFloatAmount)) {
        props.newIncome.amount = sanitisedFloatAmount
      } else {
        props.newIncome.amount = null
      }
    }
  }, 1000)

</script>

<template>
  <dialog :open="incomeOpen">
    <article>
      <header>{{ newIncome.description || "Income" }}</header>
      <form>
        <input v-model="newIncome.description" placeholder="Description" :aria-invalid="invalidIncomeDescription">
        <input :value="newIncome.amount" @input="event => onAmountInput(event, props)" placeholder="Amount" :aria-invalid="invalidIncomeAmount">
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
          <select v-if="newIncome.recurring && newSchedule.frequency == 'twoWeeks'" v-model="newSchedule.dayOfWeek">
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