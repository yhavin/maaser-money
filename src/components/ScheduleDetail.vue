<script setup>
  import { recurringFrequencies } from '../utils/constants'
  import { weekDays } from "../utils/constants"


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
          <td>{{ selectedSchedule.prototype.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
          <th>Frequency</th>
          <td>{{ recurringFrequencies.find((obj) => obj.name === selectedSchedule.frequency).label }}</td>
        </tr>
        <tr v-if="selectedSchedule.frequency === 'week' || selectedSchedule.frequency === 'twoWeeks'">
          <th>Day</th>
          <td>{{ weekDays[selectedSchedule.dayOfWeek - 1] }}</td>
        </tr>
        <tr>
          <th>Ends</th>
          <td>{{ selectedSchedule.endDate?.toDate().toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }) || "Never" }}</td>
        </tr>
      </table>
      <small v-if=selectedSchedule.prototype.conversion>Converted from {{ selectedSchedule.prototype.baseAmount }} {{ selectedSchedule.prototype.baseCurrency }}</small>
    </article>
  </dialog>
</template>

<style scoped>

</style>