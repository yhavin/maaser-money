<script setup>
  import { ArrowPathRoundedSquareIcon } from "@heroicons/vue/24/outline"

  const props = defineProps({
    userLanguage: String,
    userCurrency: String,
    selectedIncome: Object,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["closeIncomeModal", "handleDeleteIncome"])

  const emitCloseIncomeModal = () => {
    emits("closeIncomeModal")
  }

  const emitHandleDeleteIncome = (id) => {
    emits("handleDeleteIncome", id)
  }
</script>

<template>
  <dialog :open="selectedIncome" v-if="selectedIncome">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="emitCloseIncomeModal"></a>
        Income
      </header>
      <table>
        <tr>
          <th>Description</th>
          <td>{{ selectedIncome.description }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedIncome.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{{ selectedIncome.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
        </tr>
        <tr>
          <th>Ma'aser percent</th>
          <td>{{ ((selectedIncome.percent * 100).toFixed(0) + "%") }}</td>
        </tr>
        <tr>
          <th>Ma'aser owing</th>
          <td>{{ (selectedIncome.amount * selectedIncome.percent).toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr v-if="selectedIncome.recurring">
          <th class="icon-inline">Schedule <ArrowPathRoundedSquareIcon class="recurring-icon" /></th>
          <td>{{ selectedIncome.scheduleName || "No name" }}</td>
        </tr>
      </table>
      <small v-if=selectedIncome.conversion>Converted from {{ selectedIncome.baseAmount.toLocaleString(userLanguage, { style: "currency", currency: selectedIncome.baseCurrency}) }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteIncome(selectedIncome)" :aria-busy="isLoadingButton">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseIncomeModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>
  .icon-inline {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .recurring-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  @media (prefers-color-scheme: dark) {
    .recurring-icon {
      width: 1rem;
      height: 1rem;
    }
  }
</style>