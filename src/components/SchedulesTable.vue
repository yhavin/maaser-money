<script setup>
  import { recurringFrequencies } from '../utils/constants'
  
  
  const props = defineProps({
    userInfo: Object,
    userLanguage: String,
    userCurrency: String,
    schedules: Array
  })

  const emits = defineEmits(["openScheduleModal"])

  const emitOpenScheduleModal = (schedule) => {
    emits("openScheduleModal", schedule)
  }


</script>

<template>
  <article>
    <h3>Schedules</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th class="recurring-type">Type</th>
          <th>Frequency</th>
          <th class="number-align">Amount</th>
        </tr>
      </thead>
      <tr class="hover-underline" v-for="schedule in schedules" :key="schedule.id" @click="emitOpenScheduleModal(schedule)">
        <td>{{ schedule.name || "No name" }}</td>
        <td class="recurring-type">{{ schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1) }}</td>
        <td>{{ recurringFrequencies.find((obj) => obj.name === schedule.frequency).label }}</td>
        <td class="number-align">{{ schedule.prototype.baseAmount.toLocaleString(userLanguage, { style: "currency", currency: schedule.prototype.baseCurrency }) }}</td>
      </tr>
    </table>
  </article>
</template>

<style scoped>
  a, td {
      cursor: pointer;
    }

  @media (prefers-color-scheme:dark) {
    .hover-underline:hover, .hover-underline:active {
    /* text-decoration: underline; */
    background-color: #1f2f3c;
    }
  }

  @media (prefers-color-scheme:light) {
    .hover-underline:hover {
    /* text-decoration: underline; */
    background-color: #f2f9f8;
    }
  }

  .number-align {
    text-align: right;
  }

  @media (max-width: 767px) {
    .recurring-type {
      display: none;
    }
  }
</style>