import { mkdir, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore, Timestamp } from "firebase-admin/firestore"

const uid = "janKKlOTaeaW7QGaVuWqDp1k7NC3"

initializeApp({ credential: cert(JSON.parse(readFileSync("./ma-aser-471c77277553.json", "utf8"))) })
const db = getFirestore()

const collections = ["income", "maaser", "deductions", "schedules"]

// 1. Count documents in each collection
for (const name of collections) {
    const snapshot = await db.collection(name).where("uid",  "==", uid).count().get()
    console.log(name, snapshot.data().count)
}

// 2. Export documents to JSON in exports/ folder
mkdirSync("exports", { recursive: true })

const clean = (value) => {
    if (value instanceof Timestamp) return value.toDate().toISOString()
    if (Array.isArray(value)) return value.map(clean)
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]))
    }
    return value
}

for (const name of collections) {
    const snapshot = await db.collection(name).where("uid", "==",  uid).get()
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...clean(doc.data()) }))
    writeFileSync(`exports/${uid}-${name}.json`, JSON.stringify(docs, null, 2))
    console.log(name, docs.length, "->", `exports/${uid}-${name}.json`)
}

// 3. Delete all documents
const CONFIRM_DELETE = false

if (CONFIRM_DELETE) {
    for (const name of collections) {
        const snapshot = await db.collection(name).where("uid", "==", uid).get()

        for (let i = 0; i < snapshot.docs.length; i += 400) {
            const batch = db.batch()
            snapshot.docs.slice(i, i + 400).forEach(doc => batch.delete(doc.ref))
            await batch.commit()
        }

        console.log(name, snapshot.size, "deleted")
    }
} else {
    console.log("Delete switch set to false: no items deleted")
}