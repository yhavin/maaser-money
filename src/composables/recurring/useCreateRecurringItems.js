import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { calculateElapsedMonths } from "../../utils/functions.js"
import { recurringFrequencies } from "../../utils/constants.js"


export const useCreateRecurringItems = async (schedule) => {
  
}




  // const collectionRef = collection(db, schedule.type)
  // const scheduleRef = doc(db, "schedules", schedule.id)
  // const lastRepeatedDateMs = schedule.lastRepeatedDate.toMillis()
  // console.log("Last repeated:", lastRepeatedDateMs)
  // const endDateMs = schedule.endDate?.toMillis()
  // console.log("End:", endDateMs)
  // const currentDateMs = Date.now()
  // console.log("Now:", currentDateMs)
  // const checkDateMs = schedule.endDate ? Math.min(endDateMs, currentDateMs) : currentDateMs
  // console.log("Check until:", checkDateMs)

  // let itemsToCreate
  // let itemDate
  // let frequencyMs

  // const elapsedMs = checkDateMs - lastRepeatedDateMs
  // frequencyMs = recurringFrequencies.find((obj) => obj.name === schedule.frequency).ms
  // console.log("Elapsed:", elapsedMs)
  // console.log("Frequency:", frequencyMs)

  // if (schedule.frequency !== "month") {
  //   itemsToCreate = Math.max((elapsedMs / frequencyMs) - 1, 0)
  // } else {
  //   // schedule.frequency === "month"
  //   itemsToCreate = Math.max(calculateElapsedMonths(lastRepeatedDateMs, checkDateMs), 0)
  // }
  // console.log("Items:", itemsToCreate)

  // for (let i = 0; i < itemsToCreate; i++) {
  //   // itemDate should be lastRepeatedDateMs plus (i + 1) * frequencyMs
  //   // But if frequency is month, then itemDate should be lastRepeatedDate plus (i + 1) months
  //   if (schedule.frequency !== "month") {
  //     itemDate = new Date(lastRepeatedDateMs + ((i + 1) * frequencyMs))
  //   } else {
  //     let lastRepeatedDateValue = new Date(lastRepeatedDateMs)
  //     const monthIndex = lastRepeatedDateValue.getMonth()
  //     lastRepeatedDateValue.setMonth(monthIndex + (i + 1))
  //     itemDate = new Date(lastRepeatedDateValue)
  //     itemDate.setDate(schedule.dayOfMonth)
  //   }
  //   console.log("Item date:", itemDate)
  //   schedule.prototype.date = itemDate
  //   const docRef = await addDoc(collectionRef, schedule.prototype)
  //   console.log("Recurring item created in collection", schedule.type, "with ID:", docRef.id)
  //   await updateDoc(scheduleRef, { itemIds: arrayUnion(docRef.id) })
  //   await updateDoc(scheduleRef, { lastRepeatedDate: itemDate })
  // }

  // if (currentDateMs > endDateMs) {
  //   await updateDoc(scheduleRef, { active: false })
  // }

  // return itemsToCreate > 0