import { db } from "../../../firebase";
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const appId = "gitmatch-production";

export const getGoalsCollectionRef = (uid) => {
  if (!db || !uid) return null;
  return collection(db, "artifacts", appId, "users", uid, "goals");
};

export const syncUserToFirestore = async (userId, githubUsername, displayName) => {
  if (!userId || !db) return;
  try {
    const userDocRef = doc(db, "artifacts", appId, "users", userId);
    await setDoc(
      userDocRef,
      { githubUsername: githubUsername || "", displayName: displayName || "" },
      { merge: true }
    );
  } catch (err) {
    console.warn("[Firestore] User sync failed:", err);
  }
};

export const createGoal = async (uid, text) => {
  if (!uid || !text.trim()) return;
  const colRef = getGoalsCollectionRef(uid);
  if (!colRef) return;
  
  return addDoc(colRef, {
    text: text.trim(),
    completed: false,
    createdAt: serverTimestamp(),
  });
};

export const toggleGoalStatus = async (uid, goalId, currentCompletedStatus) => {
  if (!uid || !goalId) return;
  const goalDocRef = doc(getGoalsCollectionRef(uid), goalId);
  
  return updateDoc(goalDocRef, {
    completed: !currentCompletedStatus,
    updatedAt: serverTimestamp(),
  });
};

export const deleteGoal = async (uid, goalId) => {
  if (!uid || !goalId) return;
  const goalDocRef = doc(getGoalsCollectionRef(uid), goalId);
  return deleteDoc(goalDocRef);
};
