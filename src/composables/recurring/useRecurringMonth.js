import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { calculateElapsedMonths } from "../../utils/functions.js"
import { convertCurrency } from "../../utils/functions.js"


export const useRecurringMonth = async (schedule) => {
  const collectionRef = collection(db, schedule.type)
  const scheduleRef = doc(db, "schedules", schedule.id)
  const lastRepeatedDateMs = schedule.lastRepeatedDate.toMillis()
  console.log("Last repeated:", lastRepeatedDateMs)
  const endDateMs = schedule.endDate?.toMillis()
  const currentDateMs = Date.now()
  const checkDateMs = schedule.endDate ? Math.min(endDateMs, currentDateMs) : currentDateMs
  console.log("Check until:", checkDateMs)

  // Logic for creating first item (e.g., monthly schedule created on 13th, starts 15th)
  // A month hasn't passed yet but need first item
  // If list of repeated Item IDs is empty, then no first item yet
  // Today's day of month greater than or equal to chosen day of month
  // LOGIC HERE IS PROBABLY INCOMPLETE FOR FIRST OCCURRENCE

  const todayDate = new Date().getDate()
  const scheduledDate = schedule.dayOfMonth
  const shouldCreateFirstItem = todayDate === scheduledDate

  console.log(`Frequency: Monthly, Item IDs: ${schedule.itemIds.length}, Today: ${todayDate}, Scheduled: ${scheduledDate}, FirstItem: ${shouldCreateFirstItem}`)
  
  if (schedule.itemIds.length === 0 && shouldCreateFirstItem) {
    console.log("Creating first item...")
    const firstItemDate = new Date(schedule.prototype.date.toDate().setDate(schedule.dayOfMonth))
    console.log(firstItemDate)
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

  // Creation of non-first items
  const itemsToCreate = Math.max(calculateElapsedMonths(lastRepeatedDateMs, checkDateMs), 0)
  console.log("Items to create:", itemsToCreate)

  let lastRepeatedDateValue = new Date(lastRepeatedDateMs)
  const monthIndex = lastRepeatedDateValue.getMonth()

  for (let i = 1; i <= itemsToCreate; i++) {
    lastRepeatedDateValue.setMonth(monthIndex + i)
    let itemDate = new Date(lastRepeatedDateValue)
    itemDate.setDate(schedule.dayOfMonth)
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