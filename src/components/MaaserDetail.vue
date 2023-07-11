<script setup>
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
          <td>{{ selectedMaaser.date.toDate().toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }) }}</td>
        </tr>
        <tr>
          <th>Tax deductible</th>
          <td><input type="checkbox" :checked="selectedMaaser.taxDeductible" disabled></td>
        </tr>
      </table>
      <small v-if=selectedMaaser.conversion>Converted from {{ selectedMaaser.baseAmount }} {{ selectedMaaser.baseCurrency }}</small>
      <footer>
        <a role="button" href="#" class="delete outline" @click.prevent="emitHandleDeleteMaaser(selectedMaaser.id)" :aria-busy="isLoadingButton">Delete</a>
        <a role="button" href="#" class="secondary outline" @click.prevent="emitCloseMaaserModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>

</style>