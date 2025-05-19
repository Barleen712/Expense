import { useDispatch } from "react-redux";
import { addTransaction, loadingTransaction } from "../Slice/IncomeSlice";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";
import { saveToRealmIfNotExists } from "../Realm/realm";
const useTransactionListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    dispatch(loadingTransaction(true));
    const q = query(collection(db, "Transactions"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Dispatch each transaction separately
      data.forEach((transaction) => {
        dispatch(addTransaction(transaction));
        saveToRealmIfNotExists(transaction);
      });
      dispatch(loadingTransaction(false));
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useTransactionListener;
