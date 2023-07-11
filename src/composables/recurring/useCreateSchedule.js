import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"


export const useCreateSchedule = async (collectionName, prototype, itemRef, userId, defaultSchedule, newSchedule, scheduleCollectionRef) => {
  newSchedule.value = {
    type: collectionName,
    startDate: prototype.value.date,
    endDate: newSchedule.value.endDate ? new Date(`${newSchedule.value.endDate}, 00:00:00`) : null,
    frequency: newSchedule.value.frequency, 
    dayOfMonth: newSchedule.value.dayOfMonth || null,
    lastRepeatedDate: new Date(prototype.value.date.setHours(0, 0, 0, 0)),
    prototype: prototype.value,
    itemIds: [itemRef.id],
    active: true,
    uid: userId
  }

  const docRef = await addDoc(scheduleCollectionRef, newSchedule.value)
  console.log("Schedule created with ID:", docRef.id)
  await updateDoc(itemRef, { scheduleId: docRef.id })
  await updateDoc(docRef, { "prototype.scheduleId": docRef.id })
  newSchedule.value = { ...defaultSchedule }
}
