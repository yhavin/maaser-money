import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"


export const useCreateSchedule = async (collectionName, prototype, userId, defaultSchedule, newSchedule, scheduleCollectionRef) => {
  newSchedule.value = {
    type: collectionName,
    name: newSchedule.value.name,
    startDate: prototype.value.date,
    endDate: newSchedule.value.endDate ? new Date(`${newSchedule.value.endDate}, 00:00:00`) : null,
    frequency: newSchedule.value.frequency, 
    dayOfMonth: newSchedule.value.dayOfMonth || null,
    dayOfWeek: newSchedule.value.dayOfWeek || null,
    lastRepeatedDate: new Date(prototype.value.date.setHours(0, 0, 0, 0)),
    prototype: prototype.value,
    itemIds: [],
    active: true,
    uid: userId
  }

  const docRef = await addDoc(scheduleCollectionRef, newSchedule.value)
  console.log("Schedule created with ID:", docRef.id)
  await updateDoc(docRef, { "prototype.scheduleId": docRef.id })
  newSchedule.value = { ...defaultSchedule }
}
