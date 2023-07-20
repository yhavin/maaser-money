<script setup>
  import { ref, onUpdated } from "vue"
  import { recurringFrequencies } from '../utils/constants'
  import { convertCurrency } from '../utils/functions'
  import { weekDays } from "../utils/constants"
  import { monthDays } from "../utils/constants"


  const props = defineProps({
  userLanguage: String,
  userCurrency: String,
  selectedSchedule: Object,
  isLoadingButton: Boolean
})

const emits = defineEmits(["closeScheduleModal", "handleDeleteSchedule"])

const emitCloseScheduleModal = () => {
  emits("closeScheduleModal")
}

const emitHandleDeleteSchedule = (id) => {
  emits("handleDeleteSchedule", id)
}

const convertEstimate = ref(0)

onUpdated(async () => {
  props.selectedSchedule ? convertEstimate.value = await convertCurrency(props.selectedSchedule.prototype.baseAmount, props.selectedSchedule.prototype.baseCurrency, props.selectedSchedule.prototype.currency) || props.selectedSchedule.prototype.baseAmount : null
})
</script>

<template>
  <dialog :open="selectedSchedule" v-if="selectedSchedule">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="emitCloseScheduleModal"></a>
        Schedule
      </header>
      <table>
        <tr>
          <th>Name</th>
          <td>{{ selectedSchedule.name || "No name" }}</td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{{ selectedSchedule.type.charAt(0).toUpperCase() + selectedSchedule.type.slice(1) }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <!-- <td>{{ selectedSchedule.prototype.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td> -->
          <td>{{ convertEstimate.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
          <th>Frequency</th>
          <td>{{ recurringFrequencies.find((obj) => obj.name === selectedSchedule.frequency).label }}</td>
        </tr>
        <tr v-if="selectedSchedule.frequency === 'week' || selectedSchedule.frequency === 'twoWeeks'">
          <th>Day</th>
          <td>{{ weekDays[selectedSchedule.dayOfWeek - 1] }}</td>
        </tr>
        <tr v-if="selectedSchedule.frequency === 'month'">
          <th>Day</th>
          <td>{{ monthDays[selectedSchedule.dayOfMonth - 1] }}</td>
        </tr>
        <tr>
          <th>Ends</th>
          <td>{{ selectedSchedule.endDate?.toDate().toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }) || "Never" }}</td>
        </tr>
      </table>
      <small v-if=selectedSchedule.prototype.conversion>Estimated conversion from {{ selectedSchedule.prototype.baseAmount.toLocaleString(userLanguage, { style: "currency", currency: selectedSchedule.prototype.baseCurrency}) }} as of {{ new Date().toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }) }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteSchedule(selectedSchedule)" :aria-busy="isLoadingButton">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseScheduleModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>

</style>