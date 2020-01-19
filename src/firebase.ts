import { initializeApp, firestore, auth as fbAuth } from "firebase";
import { CharacterCol, CharacterRuleCol, AutomataCol } from "./types";

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
});

export const EmailAuthProvider = fbAuth.EmailAuthProvider;
export const auth = firebaseApp.auth();

export const db = firebaseApp.firestore();
db.enablePersistence().catch(function(err) {
  if (err.code == "failed-precondition") {
    console.error(
      "Multiple tabs open, persistence can only be enabled in one tab at a a time."
    );
  } else if (err.code == "unimplemented") {
    console.error(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

export const charactersCol: CharacterCol = db.collection("characters");

export const automataCol: AutomataCol = db.collection("automata");

export const serverTimestamp = firestore.FieldValue.serverTimestamp;

export function getCharacterRulesCol(charId: string): CharacterRuleCol {
  return db.collection(`characters/${charId}/rules`) as CharacterRuleCol;
}

export function createID(length = 20): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newId: string = "";
  for (let i = 0; i < length; i++) {
    newId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newId;
}
