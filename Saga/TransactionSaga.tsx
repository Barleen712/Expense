import { useDispatch } from "react-redux";
import { addTransaction, loadingTransaction } from "../Slice/IncomeSlice";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";
import { saveToRealmIfNotExists } from "../Realm/realm";
import { generateKey, decryptData } from "../Encryption/encrption";
import { User } from "@firebase/auth";

// Decryption helper
const decryptTransaction = async (transaction: { id?: string; encryptedData?: any }, user: User) => {
  const key = await generateKey(user.uid, user.providerId, 5000, 256);
  const decrypted = await decryptData(transaction.encryptedData.cipher, key, transaction.encryptedData.iv);
  return decrypted;
};

const useTransactionListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    dispatch(loadingTransaction(true));

    const q = query(collection(db, "Transactions"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (const transaction of data) {
        try {
          const decrypted = await decryptTransaction(transaction, user);
          if (decrypted !== null) {
            const parsedData = JSON.parse(decrypted);
            dispatch(addTransaction(parsedData));
            saveToRealmIfNotExists(parsedData);
          } else {
            console.error("Decryption returned null for transaction:", transaction.id);
          }
        } catch (err) {
          console.error("Decryption failed for transaction:", transaction.id, err);
        }
      }

      dispatch(loadingTransaction(false));
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useTransactionListener;
