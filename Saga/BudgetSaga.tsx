import { useDispatch } from "react-redux";
import { addBudget, loadingTransaction } from "../Slice/IncomeSlice";
import { useEffect } from "react";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db, auth } from "../Screens/FirebaseConfig";
import { saveToRealmBudgets } from "../Realm/Budgetrealm";
import { decryptData, generateKey } from "../Encryption/encrption";

const decryptTransaction = async (transaction, user) => {
  const key = await generateKey(user.uid, user.providerId, 5000, 256);
  const decrypted = await decryptData(transaction.encryptedData.cipher, key, transaction.encryptedData.iv);
  return decrypted;
};

const useBudgetListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    dispatch(loadingTransaction(true));

    const q = query(collection(db, "Budgets"), where("userId", "==", user.uid));

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
            dispatch(addBudget(parsedData));
            saveToRealmBudgets(parsedData);
          }

          dispatch(loadingTransaction(false));
        } catch (error) {
          console.error("Error decrypting transactions:", error);
          dispatch(loadingTransaction(false));
        }
      };

      handleSnapshot();
    });

    return () => unsubscribe();
  }, [dispatch]);
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
