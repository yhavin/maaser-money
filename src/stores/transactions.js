import { defineStore } from 'pinia'
import { db } from '../firebase.config.js'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

const incomeCollectionRef = collection(db, "income")
const deductionCollectionRef = collection(db, "deductions")
const maaserCollectionRef = collection(db, "maaser")
const scheduleCollectionRef = collection(db, "schedules")

const fixDate = (dateObj) => {
  if (!dateObj) return null
  if (dateObj.toDate) return dateObj // Already has toDate method
  if (dateObj.seconds !== undefined) {
    // Firestore timestamp format from cache
    return {
      toDate: () => new Date(dateObj.seconds * 1000 + (dateObj.nanoseconds || 0) / 1000000)
    }
  }
  // Fallback - try to create date directly
  return {
    toDate: () => new Date(dateObj)
  }
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    incomeItems: [],
    deductionItems: [],
    maaserItems: [],
    schedules: [],
    lastFetch: null
  }),
  
  getters: {
    // Clean public API - always return data with working dates
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
    async fetchAllData(userId) {
      // Use cached data if it exists
      if (this.lastFetch && this.incomeItems.length > 0) {
        console.log('Using cached data')
        return
      }
      
      console.log('Fetching fresh data from Firebase')
      
      try {
        // Fetch incomes
        const incomeSnapshot = await getDocs(
          query(incomeCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
        )
        const fetchedIncomes = []
        incomeSnapshot.forEach((doc) => {
          fetchedIncomes.push({ id: doc.id, ...doc.data() })
        })
        this.incomeItems = fetchedIncomes
        
        // Fetch deductions
        const deductionSnapshot = await getDocs(
          query(deductionCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
        )
        const fetchedDeductions = []
        deductionSnapshot.forEach((doc) => {
          fetchedDeductions.push({ id: doc.id, ...doc.data() })
        })
        this.deductionItems = fetchedDeductions
        
        // Fetch maasers
        const maaserSnapshot = await getDocs(
          query(maaserCollectionRef, where("uid", "==", userId), orderBy("date", "desc"))
        )
        const fetchedMaasers = []
        maaserSnapshot.forEach((doc) => {
          fetchedMaasers.push({ id: doc.id, ...doc.data() })
        })
        this.maaserItems = fetchedMaasers
        
        // Fetch schedules
        const scheduleSnapshot = await getDocs(
          query(scheduleCollectionRef, where("uid", "==", userId), where("active", "==", true), orderBy("startDate", "desc"))
        )
        const fetchedSchedules = []
        scheduleSnapshot.forEach((doc) => {
          fetchedSchedules.push({ id: doc.id, ...doc.data() })
        })
        this.schedules = fetchedSchedules
        
        this.lastFetch = Date.now()
        
      } catch (error) {
        console.error('Error fetching data:', error)
        throw error
      }
    },
    
    addToCache(type, item) {
      // Convert Date objects to Firestore-like timestamp format for localStorage compatibility
      const itemWithDate = { 
        ...item, 
        date: item.date instanceof Date ? {
          seconds: Math.floor(item.date.getTime() / 1000),
          nanoseconds: (item.date.getTime() % 1000) * 1000000
        } : item.date
      }
      
      switch(type) {
        case 'income':
          this.incomeItems.unshift(itemWithDate)
          break
        case 'deduction':
          this.deductionItems.unshift(itemWithDate)
          break
        case 'maaser':
          this.maaserItems.unshift(itemWithDate)
          break
        case 'schedule':
          this.schedules.unshift(item)
          break
      }
      console.log(`Added ${type} to cache`)
    },
    
    removeFromCache(type, itemId) {
      switch(type) {
        case 'income':
          this.incomeItems = this.incomeItems.filter(item => item.id !== itemId)
          break
        case 'deduction':
          this.deductionItems = this.deductionItems.filter(item => item.id !== itemId)
          break
        case 'maaser':
          this.maaserItems = this.maaserItems.filter(item => item.id !== itemId)
          break
        case 'schedule':
          this.schedules = this.schedules.filter(item => item.id !== itemId)
          break
      }
      console.log(`Removed ${type} from cache`)
    },
    
    
    // Optimistic updates for immediate UI feedback
    addIncomeOptimistic(income) {
      this.incomeItems.unshift(income)
    },
    
    addDeductionOptimistic(deduction) {
      this.deductionItems.unshift(deduction)
    },
    
    addMaaserOptimistic(maaser) {
      this.maaserItems.unshift(maaser)
    },
    
    removeIncomeOptimistic(incomeId) {
      this.incomeItems = this.incomeItems.filter(income => income.id !== incomeId)
    },
    
    removeDeductionOptimistic(deductionId) {
      this.deductionItems = this.deductionItems.filter(deduction => deduction.id !== deductionId)
    },
    
    removeMaaserOptimistic(maaserId) {
      this.maaserItems = this.maaserItems.filter(maaser => maaser.id !== maaserId)
    }
  },
  
  persist: true
})