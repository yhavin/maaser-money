import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { recurringFrequencies } from "../../utils/constants.js"


export const useRecurringDay = async (schedule) => {
  const collectionRef = collection(db, schedule.type)
  const scheduleRef = doc(db, "schedules", schedule.id)
  const lastRepeatedDateMs = schedule.lastRepeatedDate.toMillis()
  console.log("Last repeated:", lastRepeatedDateMs)
  const endDateMs = schedule.endDate?.toMillis()
  const currentDateMs = Date.now()
  const checkDateMs = schedule.endDate ? Math.min(endDateMs, currentDateMs) : currentDateMs
  console.log("Check until:", checkDateMs)

  const elapsedMs = checkDateMs - lastRepeatedDateMs
  const frequencyMs = recurringFrequencies.find((obj) => obj.name === schedule.frequency).ms
  console.log("Elapsed:", elapsedMs)
  console.log("Frequency:", frequencyMs)

  const itemsToCreate = Math.max((elapsedMs / frequencyMs) - 1, 0)
  console.log("Items:", itemsToCreate)

  for (let i = 1; i <= itemsToCreate; i++) {
    const itemDate = new Date(lastRepeatedDateMs + (i * frequencyMs))
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