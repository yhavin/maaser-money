<script setup>
  import { currencyOptions } from "../utils/constants"
  import { sanitiseAmount, debounce } from "../utils/functions"


  const props = defineProps({
    newMaaser: Object,
    maaserOpen: Boolean,
    userCurrency: String,
    invalidMaaserDescription: Boolean,
    invalidMaaserAmount: Boolean,
    isLoadingButton: Boolean
  })

  const emits = defineEmits(["setMaaserClosed", "handleSubmitMaaser"])

  const emitSetMaaserClosed = () => {
    emits("setMaaserClosed")
  }

  const emitHandleSubmitMaaser = () => {
    emits("handleSubmitMaaser")
  }

  const onAmountInput = debounce((event, props) => {
    const amount = event.target.value
    // Ensure that backspaced input doesn't return "NaN"
    if (amount.trim() === "") {
      props.newMaaser.amount = null
    } else {
      const sanitisedFloatAmount = parseFloat(sanitiseAmount(amount))
      console.log(sanitisedFloatAmount, typeof sanitisedFloatAmount)
      // Ensure that random characters don't get converted to NaN
      if (!isNaN(sanitisedFloatAmount)) {
        props.newMaaser.amount = sanitisedFloatAmount
      } else {
        props.newMaaser.amount = null
      }
    }
  }, 1000)

</script>

<template>
  <dialog :open="maaserOpen">
    <article>
      <header>{{ newMaaser.description || "Donation" }}</header>
      <form>
        <input v-model="newMaaser.description" placeholder="Description" :aria-invalid="invalidMaaserDescription">
        <input :value="newMaaser.amount" @input="event => onAmountInput(event, props)" placeholder="Amount" :aria-invalid="invalidMaaserAmount">
        <label>
          <input type="checkbox" v-model="newMaaser.conversion">
          Convert currency
        </label>
        <select v-if="newMaaser.conversion" v-model="newMaaser.baseCurrency" required>
          <option disabled value="" selected>Base currency</option>
          <option v-for="(currency, index) in currencyOptions" :key=index :disabled="currency === userCurrency">{{ currency }}</option>
        </select>
        <label>
          <input type="checkbox" v-model="newMaaser.taxDeductible">
          Tax deductible
        </label>
      </form>
      <footer>
          <a role="button" href="#" class="secondary outline" @click.prevent="emitSetMaaserClosed">Cancel</a>
          <a role="button" href="#" @click.prevent="emitHandleSubmitMaaser" :aria-busy="isLoadingButton">Save</a>
      </footer>
    </article>
  </dialog>
</template>