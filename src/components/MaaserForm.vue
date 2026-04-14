<script setup>
  import { currencyOptions } from '../utils/constants'
  import { recurringFrequencies } from '../utils/constants'
  import { weekDays } from "../utils/constants"
  import { monthDays } from "../utils/constants"
  import { HeartIcon } from "@heroicons/vue/24/outline"

  
  const props = defineProps({
    newMaaser: Object,
    newSchedule: Object,
    maaserOpen: Boolean,
    userCurrency: String,
    invalidMaaserDescription: Boolean,
    invalidMaaserAmount: Boolean,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["setMaaserClosed", "handleSubmitMaaser"])

  const emitSetMaaserClosed = () => {
    emits("setMaaserClosed")
  }

  const emitHandleSubmitMaaser = () => {
    emits("handleSubmitMaaser")
  }
</script>

<template>
  <dialog :open="maaserOpen">
    <article>
      <header class="modal-header"><HeartIcon class="modal-header-icon" />{{ newMaaser.description || "Donation" }}</header>
      <form>
        <input v-model="newMaaser.description" placeholder="Description" :aria-invalid="invalidMaaserDescription">
        <input v-model.number="newMaaser.amount" placeholder="Amount" :aria-invalid="invalidMaaserAmount">
        <label>
          <input type="checkbox" v-model="newMaaser.conversion">
          Convert currency
        </label>
        <select v-if="newMaaser.conversion" v-model="newMaaser.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index :disabled="currency === userCurrency">{{ currency }}</option>
        </select>
        <label>
          <input type="checkbox" v-model="newMaaser.taxDeductible">
          Tax deductible
        </label>
        <label>
          <input type="checkbox" v-model="newMaaser.recurring">
          Recurring
        </label>
        <input v-if="newMaaser.recurring" v-model="newSchedule.name" placeholder="Schedule name">
        <div class="grid">
          <select v-if="newMaaser.recurring" v-model="newSchedule.frequency">
            <option v-for="(frequency, index) in recurringFrequencies" :key="index" :value="frequency.name">{{ frequency.label }}</option>
          </select>
          <select v-if="newMaaser.recurring && newSchedule.frequency == 'week'" v-model="newSchedule.dayOfWeek">
            <option v-for="(day, index) in weekDays" :value="index + 1">{{ day }}</option>
          </select>
          <select v-if="newMaaser.recurring && newSchedule.frequency == 'twoWeeks'" v-model="newSchedule.dayOfWeek">
            <option v-for="(day, index) in weekDays" :value="index + 1">{{ day }}</option>
          </select>
          <select v-if="newMaaser.recurring && newSchedule.frequency == 'month'" v-model="newSchedule.dayOfMonth">
            <option v-for="(day, index) in monthDays" :value="index + 1">{{ day }}</option>
          </select>
        </div>
        <label v-if="newMaaser.recurring && newSchedule.frequency">
          Repeat until
          <input v-if="newMaaser.recurring && newSchedule.frequency" type="date" v-model="newSchedule.endDate">
          <small>Leave blank to repeat forever</small>
        </label>
      </form>
      <footer>
          <a role="button" href="#" class="secondary outline" @click.prevent="emitSetMaaserClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitMaaser" :aria-busy="isLoadingButton">Save</a>
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