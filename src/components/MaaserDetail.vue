<script setup>
  const props = defineProps({
    selectedMaaser: Object
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
          <td>{{ selectedMaaser.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>{{ selectedMaaser.date.toDate().toLocaleDateString() }}</td>
        </tr>
        <tr>
          <th>Tax deductible</th>
          <td><input type="checkbox" :checked="selectedMaaser.taxDeductible" disabled></td>
        </tr>
      </table>
      <footer>
        <a role="button" href="#" class="secondary" @click.prevent="emitHandleDeleteMaaser(selectedMaaser.id)">Delete</a>
        <a role="button" href="#" @click.prevent="emitCloseMaaserModal">Exit</a>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>

</style>