<script setup>
  import { ref } from "vue"


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

</script>

<template>
  <main class="container">
    <article>
      <h3>Add income</h3>
      <form @submit.prevent="handleSubmitIncome">
        <div class="grid">
          <input v-model="newIncome.description" placeholder="Income">
          <input v-model.number="newIncome.amount" placeholder="Amount">
        </div>
        <button>Add income</button>
      </form>

      <h3>Add ma'aser</h3>
      <form @submit.prevent="handleSubmitMaaser">
        <div class="grid">
          <input v-model="newMaaser.description" placeholder="Income">
          <input v-model.number="newMaaser.amount" placeholder="Amount">
        </div>
        <button>Add ma'aser</button>
      </form>
    </article>

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
    
  </main>
</template>