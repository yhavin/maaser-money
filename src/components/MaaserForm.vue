<script setup>
  import { currencyOptions } from '../assets/currencyOptions';


  const props = defineProps({
    newMaaser: Object,
    maaserOpen: Boolean,
    invalidMaaserDescription: Boolean,
    invalidMaaserAmount: Boolean
  })

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
      <header>{{ newMaaser.description || "Donation" }}</header>
      <form>
        <input v-model="newMaaser.description" placeholder="Description" :aria-invalid="invalidMaaserDescription">
        <input v-model.number="newMaaser.amount" placeholder="Amount" :aria-invalid="invalidMaaserAmount">
        <label>
          <input type="checkbox" v-model="newMaaser.conversion">
          Convert currency
        </label>
        <select v-if="newMaaser.conversion" v-model="newMaaser.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index>{{ currency }}</option>
        </select>
        <label>
          <input type="checkbox" v-model="newMaaser.taxDeductible">
          Tax deductible
        </label>
      </form>
      <footer>
          <a role="button" href="#" class="secondary" @click.prevent="emitSetMaaserClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitMaaser">Save</a>
      </footer>
    </article>
  </dialog>
</template>