import { useState, useEffect, useCallback } from "react";
import { onSnapshot, query, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { getGoalsCollectionRef, createGoal, toggleGoalStatus, deleteGoal } from "../services/goalService";

export const useGoals = (user) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const goalsRef = getGoalsCollectionRef(user.uid);
    if (!goalsRef) {
      setLoading(false);
      return;
    }

    const goalsQuery = query(goalsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      goalsQuery,
      (snapshot) => {
        const loadedGoals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(loadedGoals);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to goals:", error);
        setLoading(false);
      }
    );

    // Initial population for a new user if the list is empty
    if (goals.length === 0 && !localStorage.getItem("goals_initialized")) {
      const initialGoals = [
        { text: "Solve one good first issue", completed: false },
        { text: "Review a pull request in Network", completed: false },
        { text: "Update profile with primary stack", completed: true },
      ];

      initialGoals.forEach(async (goal) => {
        await addDoc(goalsRef, {
          ...goal,
          createdAt: serverTimestamp(),
        });
      });
      localStorage.setItem("goals_initialized", "true");
    }

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const addGoal = useCallback(async (text) => {
    if (!user?.uid) return;
    await createGoal(user.uid, text);
  }, [user?.uid]);

  const toggleGoal = useCallback(async (id, completed) => {
    if (!user?.uid) return;
    await toggleGoalStatus(user.uid, id, completed);
  }, [user?.uid]);

  const removeGoal = useCallback(async (id) => {
    if (!user?.uid) return;
    await deleteGoal(user.uid, id);
  }, [user?.uid]);

  return { goals, loading, addGoal, toggleGoal, removeGoal };
};
