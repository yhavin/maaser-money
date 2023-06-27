import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getAnalytics, logEvent } from "firebase/analytics"


const firebaseConfig = {
  apiKey: "AIzaSyD8tfr1ZQN-3NLutP0rVHLd-FQscotK9oY",
  authDomain: "ma-aser.firebaseapp.com",
  projectId: "ma-aser",
  storageBucket: "ma-aser.appspot.com",
  messagingSenderId: "530006556930",
  appId: "1:530006556930:web:f2fbfd5abba2ad4d48821b",
  measurementId: "G-7WKGLR1LH7"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const analytics = getAnalytics(app)

export { db, auth, analytics }