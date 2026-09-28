import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateUserProfile = (uid, data) =>
  setDoc(doc(db, "users", uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });

export const updateGoals = (uid, steps, calories) =>
  setDoc(doc(db, "users", uid), { steps, calories }, { merge: true });

export const getDailySteps = async (email) => {
  if (!email) return [];
  const snapshot = await getDocs(collection(db, "users", email, "dailySteps"));
  return snapshot.docs.map((item) => ({ id: item.id, date: item.id, ...item.data() }));
};

export const saveDailySteps = (email, { steps, calories, distance, date }) =>
  setDoc(doc(db, "users", email, "dailySteps", date), { steps, calories, distance, date });
