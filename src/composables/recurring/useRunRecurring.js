import { db, auth } from "../../firebase.config.js"
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { useCreateRecurringItems } from "./useCreateRecurringItems.js"


export const useRunRecurring = async (userId, scheduleCollectionRef) => {
  console.log("Running recurring...")
  const querySnapshot = await getDocs(
    query(scheduleCollectionRef, where("uid", "==", userId), where("active", "==", true))
  )
  const fetchedSchedules = []
  querySnapshot.forEach((doc) => {
    fetchedSchedules.push({ id: doc.id, ...doc.data() })
  })

  if (!fetchedSchedules.length) {
    console.log("No recurring")
  }
  
  fetchedSchedules.forEach(async (schedule) => {
    console.log("Schedule ID:", schedule.id)
    await useCreateRecurringItems(schedule)
  })
}