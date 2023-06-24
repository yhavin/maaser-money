<script setup>
  import { ref, computed } from "vue"


  let incomeId = 0
  const newIncome = ref({ description: "", amount: null, date: null })
  const incomes = ref([])

  const handleSubmitIncome = () => {
    incomes.value.push({ 
      id: incomeId++, 
      description: newIncome.value.description, 
      amount: newIncome.value.amount,
      date: new Date()
    })
    newIncome.value = { description: "", amount: null, date: null }
  }

  let maaserId = 0
  const newMaaser = ref({ description: "", amount: null, date: null })
  const maasers = ref([])

  const handleSubmitMaaser = () => {
    maasers.value.push({ 
      id: maaserId++, 
      description: newMaaser.value.description, 
      amount: newMaaser.value.amount,
      date: new Date()
    })
    newMaaser.value = { description: "", amount: null, date: null }
  }

  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, income) =>  sum + income.amount, 0)
  })

  const totalMaaser = computed(() => {
    return maasers.value.reduce((sum, maaser) =>  sum + maaser.amount, 0)
  })

  const maaserDue = computed(() => {
    return (totalIncome.value / 10) - totalMaaser.value
  })

</script>

<template>
  <main class="container">
    <article>
      <div class="grid">
        <form @submit.prevent="handleSubmitIncome">
          <h3>Add income</h3>
          <div class="grid">
            <input v-model="newIncome.description" placeholder="Income">
            <input v-model.number="newIncome.amount" placeholder="Amount">
          </div>
          <button>Add income</button>
        </form>

        <form @submit.prevent="handleSubmitMaaser">
          <h3>Add ma'aser</h3>
          <div class="grid">
            <input v-model="newMaaser.description" placeholder="Ma'aser">
            <input v-model.number="newMaaser.amount" placeholder="Amount">
          </div>
          <button>Add ma'aser</button>
        </form>
      </div>
    </article>

    <article>
      <details open>
        <summary>Income</summary>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(income, index) in incomes" :key="index">
              <td>{{ income.description }}</td>
              <td>{{ income.amount }}</td>
              <td>{{ income.date.toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </details>

      <details open>
        <summary>Ma'aser</summary>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(maaser, index) in maasers" :key="index">
              <td>{{ maaser.description }}</td>
              <td>{{ maaser.amount }}</td>
              <td>{{ maaser.date.toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </details>
    </article>
    
    <article>
      <h3>Balance</h3>
      <p>Total income: {{ totalIncome.toLocaleString() }}</p>
      <p>Total ma'aser: {{ totalMaaser.toLocaleString() }}</p>
      <p>Ma'aser due: {{ maaserDue.toLocaleString() }}</p>
    </article>
    
  </main>
</template>