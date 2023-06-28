<script setup>
  const props = defineProps({
    newDeduction: Object,
    deductionOpen: Boolean,
    invalidDeductionDescription: Boolean,
    invalidDeductionAmount: Boolean,
    invalidDeductionPercent: Boolean
  })

  const emits = defineEmits(["setDeductionClosed", "handleSubmitDeduction"])

  const emitSetDeductionClosed = () => {
    emits("setDeductionClosed")
  }

  const emitHandleSubmitDeduction = () => {
    emits("handleSubmitDeduction")
  }

</script>

<template>
  <dialog :open="deductionOpen">
    <article>
      <header>Add deduction</header>
      <form>
        <input v-model="newDeduction.description" placeholder="Description" :aria-invalid="invalidDeductionDescription">
        <input v-model.number="newDeduction.amount" placeholder="Amount" :aria-invalid="invalidDeductionAmount">
        <input v-model="newDeduction.percent" placeholder="%" :aria-invalid="invalidDeductionPercent">
      </form>
      <footer>
          <a role="button" href="#" class="secondary" @click.prevent="emitSetDeductionClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitDeduction">Add deduction</a>
      </footer>
    </article>
  </dialog>
</template>