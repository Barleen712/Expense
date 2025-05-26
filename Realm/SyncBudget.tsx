import { getRealm } from "./realm";
import { auth, db } from "../Screens/FirebaseConfig";
import { AddBudget } from "../Screens/FirestoreHandler";
import { generateKey, encryptData } from "../Encryption/encrption";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
let isSyncing = false;
export async function syncUnsyncedBudget() {
  if (isSyncing) {
    return;
  }

  isSyncing = true;
  const realm = await getRealm();
  const unsynced = realm.objects("Budget").filtered("synced == false");
  const user = auth.currentUser;
  for (const txn of unsynced) {
    const budgetData = {
      _id: txn._id,
      amount: txn.amount,
      category: txn.category,
      month: txn.month,
      percentage: txn.percentage,
      notified: txn.notified,
      notification: txn.notification,
      year: txn.year,
      userId: user.uid,
    };
    // const key = await generateKey(user?.uid, user?.providerId, 5000, 256);
    // const encryptedData = await encryptData(JSON.stringify(budgetData), key);
    // const data = { encryptedData, userid: user.uid };
    const success = await AddBudget(budgetData);
    if (success) {
      realm.write(() => {
        txn.synced = true;
      });
    }
  }
  isSyncing = false;
}
export const syncPendingDeletesBudget = async ({ isConnected }) => {
  if (!isConnected) return;
  const realm = await getRealm();
  const pendingDeletes = realm.objects("Budget").filtered("pendingDelete == true");
  for (const transaction of pendingDeletes) {
    try {
      const q = query(collection(db, "Budgets"), where("_id", "==", transaction._id));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
      await Promise.all(deletePromises);

      realm.write(() => {
        realm.delete(transaction);
      });

      console.log(`✅ Synced and deleted transaction: ${transaction._id}`);
    } catch (error) {
      console.error(`❌ Error syncing/deleting transaction ${transaction._id}:`, error);
    }
  }
};
export async function syncPendingUpdatesToFirestoreBudgets() {
  const realm = await getRealm();
  try {
    // Filter all transactions with pendingUpdate = true
    const pendingTransactions = realm.objects("Budget").filtered("pendingUpdate == true");
    for (const tx of pendingTransactions) {
      const transactionId = tx._id;

      // Prepare the data (omit internal Realm metadata)
      const { _id, ...data } = tx.toJSON();
      const dataToUpdate = {
        ...data,
        synced: true,
        pendingUpdate: false,
      };

      // Query Firestore to find document with matching _id
      const q = query(collection(db, "Budgets"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, "Budgets", docSnap.id);

        // Update Firestore
        await updateDoc(docRef, dataToUpdate);
        // Update Realm to clear pendingUpdate flag
        realm.write(() => {
          const txToUpdate = realm.objectForPrimaryKey("Budget", transactionId);
          if (txToUpdate) {
            txToUpdate.synced = true;
            txToUpdate.pendingUpdate = false;
          }
        });
      } else {
        console.warn(`No Firestore transaction found for _id: ${transactionId}`);
      }
    }

    return { success: true, message: "All pending updates synced" };
  } catch (error) {
    console.error("Error syncing transactions:", error);
    return { success: false, message: error.message };
  }
}
