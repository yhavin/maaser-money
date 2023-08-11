import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { recurringFrequencies } from "../../utils/constants.js"
import { calculateElapsedMonths } from "../../utils/functions.js"


export const useRecurringMonth = async (schedule) => {
  const collectionRef = collection(db, schedule.type)
  const scheduleRef = doc(db, "schedules", schedule.id)
  const lastRepeatedDateMs = schedule.lastRepeatedDate.toMillis()
  console.log("Last repeated:", lastRepeatedDateMs)
  const endDateMs = schedule.endDate?.toMillis()
  const currentDateMs = Date.now()
  const checkDateMs = schedule.endDate ? Math.min(endDateMs, currentDateMs) : currentDateMs
  console.log("Check until:", checkDateMs)

  const itemsToCreate = Math.max(calculateElapsedMonths(lastRepeatedDateMs, checkDateMs), 0)
  console.log("Months:", itemsToCreate)

  let lastRepeatedDateValue = new Date(lastRepeatedDateMs)
  const monthIndex = lastRepeatedDateValue.getMonth()

  for (let i = 1; i <= itemsToCreate; i++) {
    lastRepeatedDateValue.setMonth(monthIndex + i)
    let itemDate = new Date(lastRepeatedDateValue)
    itemDate.setDate(schedule.dayOfMonth)
    console.log("Item date:", itemDate)
    schedule.prototype.date = itemDate
    
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