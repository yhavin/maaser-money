import { defineStore, acceptHMRUpdate } from 'pinia'
import { db } from '../firebase.config.js'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

const incomeCollectionRef = collection(db, "income")
const deductionCollectionRef = collection(db, "deductions")
const maaserCollectionRef = collection(db, "maaser")
const scheduleCollectionRef = collection(db, "schedules")

let sessionBilledReads = 0

const logSnapshot = (label, snapshot) => {
  const fromCache = snapshot.metadata.fromCache
  const changed = snapshot.docChanges().length
  const total = snapshot.size

  if (fromCache) {
    console.log(`%c[CACHE] ${label}: loaded ${total} docs from device storage — 0 Firebase reads used`, 'color: green')
  } else if (changed === 0) {
    console.log(`%c[SERVER] ${label}: server confirmed nothing changed — 0 Firebase reads used`, 'color: blue')
  } else {
    sessionBilledReads += changed
    console.log(`%c[SERVER] ${label}: ${changed} doc(s) changed/added — ${changed} Firebase reads used (${sessionBilledReads} billed this session total)`, 'color: orange')
  }
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    incomeItems: [],
    deductionItems: [],
    maaserItems: [],
    scheduleItems: [],
    listeners: []
  }),

  getters: {
    incomes: (state) => state.incomeItems,
    deductions: (state) => state.deductionItems,
    maasers: (state) => state.maaserItems,
    schedules: (state) => state.scheduleItems,

    totalIncome: (state) => {
      return state.incomeItems.reduce((sum, income) => sum + income.amount, 0)
    },

    totalDeductions: (state) => {
      return state.deductionItems.reduce((sum, deduction) => sum + deduction.amount, 0)
    },

    totalMaaser: (state) => {
      return state.maaserItems.reduce((sum, maaser) => sum + maaser.amount, 0)
    },

    totalTaxDeductible: (state) => {
      const deductible = state.maaserItems.filter((maaser) => maaser.taxDeductible)
      return deductible.reduce((sum, maaser) => sum + maaser.amount, 0)
    },

    maaserDue: (state) => {
      let owing = 0
      state.incomeItems.forEach((income) => {
        owing += (income.amount * income.percent)
      })

      let owingDeducted = 0
      state.deductionItems.forEach((deduction) => {
        owingDeducted += (deduction.amount * deduction.percent)
      })
      return owing - owingDeducted - state.maaserItems.reduce((sum, maaser) => sum + maaser.amount, 0)
    }
  },

  actions: {
    setupListeners(userId) {
      if (this.listeners.length > 0) return

      console.log('Setting up real-time listeners')

      try {
        const incomeUnsubscribe = onSnapshot(
          query(incomeCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.incomeItems = items
            logSnapshot('income', snapshot)
          },
          (error) => console.error('Income listener error:', error)
        )

        const deductionUnsubscribe = onSnapshot(
          query(deductionCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.deductionItems = items
            logSnapshot('deductions', snapshot)
          },
          (error) => console.error('Deduction listener error:', error)
        )

        const maaserUnsubscribe = onSnapshot(
          query(maaserCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.maaserItems = items
            logSnapshot('maaser', snapshot)
          },
          (error) => console.error('Maaser listener error:', error)
        )

        const scheduleUnsubscribe = onSnapshot(
          query(scheduleCollectionRef, where("uid", "==", userId), where("active", "==", true), orderBy("startDate", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.scheduleItems = items
            logSnapshot('schedules', snapshot)
          },
          (error) => console.error('Schedule listener error:', error)
        )

        this.listeners = [incomeUnsubscribe, deductionUnsubscribe, maaserUnsubscribe, scheduleUnsubscribe]

      } catch (error) {
        console.error('Error setting up listeners:', error)
        throw error
      }
    },

    cleanupListeners() {
      console.log('Cleaning up listeners')
      this.listeners.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
      this.listeners = []
    },

    resetForLogout() {
      this.cleanupListeners()
      this.incomeItems = []
      this.deductionItems = []
      this.maaserItems = []
      this.scheduleItems = []
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionsStore, import.meta.hot))
}
