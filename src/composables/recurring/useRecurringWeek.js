import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { calculateElapsedWeeks } from "../../utils/functions.js"
import { calculateElapsedTwoWeeks } from "../../utils/functions.js"
import { convertCurrency } from "../../utils/functions.js"


export const useRecurringWeek = async (schedule, numWeeks) => {
  const collectionRef = collection(db, schedule.type)
  const scheduleRef = doc(db, "schedules", schedule.id)
  const lastRepeatedDateMs = schedule.lastRepeatedDate.toMillis()

  const endDateMs = schedule.endDate?.toMillis()
  const currentDateMs = Date.now()
  const checkDateMs = schedule.endDate ? Math.min(endDateMs, currentDateMs) : currentDateMs
  console.log("Check until:", checkDateMs)

  // Logic for creating first item (e.g., weekly schedule created Thursday, starts Monday)
  // A week hasn't passed but need first item
  // If list of repeated Item IDs is empty, then no first item yet
  // Today's day of week equals chosen day of week

  console.log("Item IDs:", schedule.itemIds.length, "Day:", new Date().getDay() === schedule.dayOfWeek - 1)
  if (numWeeks === 1 && schedule.itemIds.length === 0 && new Date().getDay() === schedule.dayOfWeek - 1) {
    console.log("Creating first item...")
    const firstItemDate = new Date(new Date().setHours(0, 0, 0))
    schedule.prototype.date = firstItemDate

    schedule.prototype.amount = schedule.prototype.conversion
    ? await convertCurrency(schedule.prototype.baseAmount, schedule.prototype.baseCurrency, schedule.prototype.currency, firstItemDate)
    : schedule.prototype.amount

    const docRef = await addDoc(collectionRef, schedule.prototype)
    console.log("Recurring item created in collection", schedule.type, "with ID:", docRef.id)
    await updateDoc(docRef, { scheduleName: schedule.name})

    await updateDoc(scheduleRef, { itemIds: arrayUnion(docRef.id) })
    await updateDoc(scheduleRef, { lastRepeatedDate: firstItemDate })
  }

  
  let [frequencyMs, itemsToCreate] = numWeeks === 1 ? calculateElapsedWeeks(lastRepeatedDateMs, checkDateMs) : calculateElapsedTwoWeeks(lastRepeatedDateMs, checkDateMs)
  itemsToCreate = Math.max(itemsToCreate, 0)
  console.log("Items:", itemsToCreate)

  for (let i = 1; i <= itemsToCreate; i++) {
    const itemDate = new Date(lastRepeatedDateMs + (i * frequencyMs))
    console.log("Item date:", itemDate)
    schedule.prototype.date = itemDate

    schedule.prototype.amount = schedule.prototype.conversion
    ? await convertCurrency(schedule.prototype.baseAmount, schedule.prototype.baseCurrency, schedule.prototype.currency, itemDate)
    : schedule.prototype.amount

    const docRef = await addDoc(collectionRef, schedule.prototype)
    console.log("Recurring item created in collection", schedule.type, "with ID:", docRef.id)
    await updateDoc(docRef, { scheduleName: schedule.name})

    await updateDoc(scheduleRef, { itemIds: arrayUnion(docRef.id) })
    await updateDoc(scheduleRef, { lastRepeatedDate: itemDate })
  }

  if (currentDateMs > endDateMs) {
    await updateDoc(scheduleRef, { active: false })
  }

  return itemsToCreate > 0
}