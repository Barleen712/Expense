import { useDispatch } from "react-redux";
import { addBudget, loadingTransaction } from "../Slice/IncomeSlice";
import { useEffect } from "react";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";
import { saveToRealmBudgets } from "../Realm/Budgetrealm";
const useBudgetListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    dispatch(loadingTransaction(true));
    const q = query(collection(db, "Budgets"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      data.forEach((transaction) => {
        dispatch(addBudget(transaction));
        saveToRealmBudgets(transaction);
      });
      dispatch(loadingTransaction(false));
    });

    return () => unsubscribe();
  }, [dispatch]);
};
export const getUserDocument = async () => {
  const user = auth.currentUser;
  try {
    if (!user) return;
    const q = query(collection(db, "Pins"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No PIN document exists for this user");
      return null;
    }
    const pinDoc = querySnapshot.docs[0];
    const pinData = pinDoc.data();
    return {
      Pin: pinData.Pin,
    };
  } catch (error) {
    console.error("Error fetching PIN:", error);
    throw error;
  }
};
export const getUseNamerDocument = async () => {
  const user = auth.currentUser;
  try {
    if (!user) return;
    const q = query(collection(db, "Names"), where("userid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log(userData.index);
    return {
      Name: userData.User,
      Photo: userData.Photo,
      pinSet: userData.pinSet,
      ID: userDoc.id,
      Index: userData.index,
      pin: userData.pin,
      Google: userData.Google,
    };
  } catch (error) {
    console.error("Error fetching PIN:", error);
    throw error;
  }
};

export default useBudgetListener;
