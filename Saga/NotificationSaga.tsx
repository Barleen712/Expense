import { useDispatch } from "react-redux";
import { addNotification,loadingTransaction} from "../Slice/IncomeSlice"
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";

const useNotificationListener = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      const user = auth.currentUser;
      if (!user) return;
      dispatch(loadingTransaction(true))
      const q = query(collection(db, "Notification"), where("userId", "==", user.uid));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        data.forEach((transaction) => {
          dispatch(addNotification(transaction));
        });
        dispatch(loadingTransaction(false))
      });
  
      return () => unsubscribe();
    }, [dispatch]);
  };
  

export default useNotificationListener
