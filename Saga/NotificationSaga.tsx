import { useDispatch } from "react-redux";
import { addNotification, loadingTransaction } from "../Slice/IncomeSlice";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";
import { decryptData, generateKey } from "../Encryption/encrption";

const decryptTransaction = async (transaction, user) => {
  const key = await generateKey(user.uid, user.providerId, 5000, 256);
  const decrypted = await decryptData(transaction.encryptedData.cipher, key, transaction.encryptedData.iv);
  return decrypted;
};

const useNotificationListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    dispatch(loadingTransaction(true));

    const q = query(collection(db, "Notification"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const handleSnapshot = async () => {
        try {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          for (const transaction of data) {
            const decrypted = await decryptTransaction(transaction, user);
            const parsedData = JSON.parse(decrypted);
            dispatch(addNotification(parsedData));
          }

          dispatch(loadingTransaction(false));
        } catch (error) {
          console.error("Error decrypting notifications:", error);
          dispatch(loadingTransaction(false));
        }
      };

      handleSnapshot();
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useNotificationListener;
