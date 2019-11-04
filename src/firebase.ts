import { initializeApp } from 'firebase'

// Get a Firestore instance
export const firebaseApp = initializeApp({
  apiKey: "AIzaSyC9UksAfuE2u48JTwfxW_eSjXfV5sPvQjU",
  authDomain: "heimr-chars.firebaseapp.com",
  databaseURL: "https://heimr-chars.firebaseio.com",
  projectId: "heimr-chars",
  storageBucket: "heimr-chars.appspot.com",
  messagingSenderId: "409786001633",
  appId: "1:409786001633:web:3c496047b36c83d5306fa0",
  measurementId: "G-YZ5QQN5LXP"
})

export const auth = firebaseApp.auth()

export const db = firebaseApp.database()
export const charactersRef = db.ref('characters')
