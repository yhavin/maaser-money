<script setup>
  const props = defineProps(["newIncome", "incomeOpen", "invalidIncomeDescription", "invalidIncomeAmount", "invalidIncomePercent"])

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
      <header>Add income</header>
      <form>
        <input v-model="newIncome.description" placeholder="Description" :aria-invalid="invalidIncomeDescription">
        <input v-model.number="newIncome.amount" placeholder="Amount" :aria-invalid="invalidIncomeAmount">
        <input v-model="newIncome.percent" placeholder="%" :aria-invalid="invalidIncomePercent">
      </form>
      <footer>
          <a role="button" href="#" class="secondary" @click.prevent="emitSetIncomeClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitIncome">Add income</a>
      </footer>
    </article>
  </dialog>
</template>