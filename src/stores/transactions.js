import { defineStore } from 'pinia'
import { db } from '../firebase.config.js'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

const incomeCollectionRef = collection(db, "income")
const deductionCollectionRef = collection(db, "deductions")
const maaserCollectionRef = collection(db, "maaser")
const scheduleCollectionRef = collection(db, "schedules")

const fixDate = (dateObj) => {
  if (!dateObj) return null
  if (dateObj.toDate) return dateObj // Already has toDate method
  if (dateObj.seconds !== undefined) {
    // Firestore timestamp format
    return {
      toDate: () => new Date(dateObj.seconds * 1000 + (dateObj.nanoseconds || 0) / 1000000)
    }
  }
  // Otherwise create date directly
  return {
    toDate: () => new Date(dateObj)
  }
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    incomeItems: [],
    deductionItems: [],
    maaserItems: [],
    scheduleItems: [],
    listeners: [],
    initialized: false
  }),
  
  persist: {
    key: 'maaser-transactions',
    storage: localStorage,
    paths: ['incomeItems', 'deductionItems', 'maaserItems', 'scheduleItems', 'initialized']
  },
  
  getters: {
    incomes: (state) => {
      return state.incomeItems.map(income => ({
        ...income,
        date: fixDate(income.date)
      }))
    },
    
    deductions: (state) => {
      return state.deductionItems.map(deduction => ({
        ...deduction,
        date: fixDate(deduction.date)
      }))
    },
    
    maasers: (state) => {
      return state.maaserItems.map(maaser => ({
        ...maaser,
        date: fixDate(maaser.date)
      }))
    },

    schedules: (state) => {
      return state.scheduleItems.map(schedule => ({
        ...schedule,
        date: fixDate(schedule.date)
      }))
    },
    
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
      console.log('Setting up real-time listeners')
      
      // Clear any existing listeners
      this.cleanupListeners()
      
      try {
        // Income listener
        const incomeUnsubscribe = onSnapshot(
          query(incomeCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.incomeItems = items
            console.log(`Updated ${items.length} income items`)
          },
          (error) => console.error('Income listener error:', error)
        )
        
        
        // Deduction listener
        const deductionUnsubscribe = onSnapshot(
          query(deductionCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.deductionItems = items
            console.log(`Updated ${items.length} deduction items`)
          },
          (error) => console.error('Deduction listener error:', error)
        )
        
        
        // Maaser listener
        const maaserUnsubscribe = onSnapshot(
          query(maaserCollectionRef, where("uid", "==", userId), orderBy("date", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.maaserItems = items
            console.log(`Updated ${items.length} maaser items`)
          },
          (error) => console.error('Maaser listener error:', error)
        )
        
        // Schedule listener
        const scheduleUnsubscribe = onSnapshot(
          query(scheduleCollectionRef, where("uid", "==", userId), where("active", "==", true), orderBy("startDate", "desc")),
          (snapshot) => {
            const items = []
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() })
            })
            this.scheduleItems = items
            console.log(`Updated ${items.length} schedule items`)
          },
          (error) => console.error('Schedule listener error:', error)
        )
        
        // Store unsubscribe functions
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
      
      // Reset initialization state
      this.initialized = false
    },
  }
})