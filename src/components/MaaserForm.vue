<script setup>
  const props = defineProps(["newMaaser", "maaserOpen", "invalidMaaserDescription", "invalidMaaserAmount"])

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
      <header>Add ma'aser</header>
      <form>
        <input v-model="newMaaser.description" placeholder="Description" :aria-invalid="invalidMaaserDescription">
        <input v-model.number="newMaaser.amount" placeholder="Amount" :aria-invalid="invalidMaaserAmount">
        <label>
          <input type="checkbox" v-model="newMaaser.taxDeductible">
          Tax deductible
        </label>
      </form>
      <footer>
          <a role="button" href="#" class="secondary" @click.prevent="emitSetMaaserClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitMaaser">Add ma'aser</a>
      </footer>
    </article>
  </dialog>
</template>