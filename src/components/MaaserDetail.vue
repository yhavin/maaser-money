<script setup>
  import { ArrowPathRoundedSquareIcon } from "@heroicons/vue/24/outline"

  const props = defineProps({
    userLanguage: String,
    userCurrency: String,
    selectedMaaser: Object,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["closeMaaserModal", "handleDeleteMaaser"])

  const emitCloseMaaserModal = () => {
    emits("closeMaaserModal")
  }

  const emitHandleDeleteMaaser = (id) => {
    emits("handleDeleteMaaser", id)
  }
</script>

<template>
  <dialog :open="selectedMaaser" v-if="selectedMaaser">
    <article>
      <header>
        <a href="#" class="close" @click.prevent="emitCloseMaaserModal"></a>
        Ma'aser
      </header>
      <table>
        <tr>
          <th>Description</th>
          <td>{{ selectedMaaser.description }}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>{{ selectedMaaser.amount.toLocaleString(userLanguage, { style: "currency", currency: userCurrency }) }}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{{ selectedMaaser.date.toDate().toLocaleDateString("default", { day: "numeric", month: "short", year: "numeric" }) }}</td>
        </tr>
        <tr>
          <th>Tax deductible</th>
          <td><input type="checkbox" :checked="selectedMaaser.taxDeductible" disabled></td>
        </tr>
        <tr v-if="selectedMaaser.recurring">
          <th class="icon-inline">Schedule <ArrowPathRoundedSquareIcon class="recurring-icon" /></th>
          <td>{{ selectedMaaser.scheduleName || "No name" }}</td>
        </tr>
      </table>
      <small v-if=selectedMaaser.conversion>Converted from {{ selectedMaaser.baseAmount.toLocaleString(userLanguage, { style: "currency", currency: selectedMaaser.baseCurrency}) }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteMaaser(selectedMaaser)" :aria-busy="isLoadingButton">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseMaaserModal">Exit</a>
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