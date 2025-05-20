import Realm from "realm";
import { AddTransaction } from "../Screens/FirestoreHandler";
import { TransactionSchema } from "./Schema"; // adjust path
import { auth, db } from "../Screens/FirebaseConfig";
import NetInfo from "@react-native-community/netinfo";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getRealm } from "./realm";
let isSyncing = false;
export async function syncUnsyncedTransactions() {
  if (isSyncing) {
    return;
  }

  isSyncing = true;
  console.log("✅ Starting sync function");
  const realm = await Realm.open({
    schema: [TransactionSchema],
    schemaVersion: 1,
  });
  const unsynced = realm.objects("Transaction").filtered("synced == false");
  const user = auth.currentUser;
  for (const txn of unsynced) {
    const txnData = {
      _id: txn._id,
      amount: txn.amount,
      description: txn.description,
      category: txn.category,
      wallet: txn.wallet,
      moneyCategory: txn.moneyCategory,
      Date: txn.Date,
      repeat: txn.repeat,
      Frequency: txn.Frequency,
      endAfter: txn.endAfter,
      endDate: txn.endDate,
      startDate: txn.startDate,
      startMonth: txn.startMonth,
      startYear: txn.startYear,
      userId: user?.uid,
    };

    const success = await AddTransaction(txnData);

    if (success) {
      realm.write(() => {
        txn.synced = true;
      });
    }
  }
  isSyncing = false;
}
export const syncPendingDeletes = async () => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);
  if (!isConnected) return;
  const realm = await getRealm();
  const pendingDeletes = realm.objects("Transaction").filtered("pendingDelete == true");
  for (const transaction of pendingDeletes) {
    try {
      const q = query(collection(db, "Transactions"), where("_id", "==", transaction._id));
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
export async function syncPendingUpdatesToFirestore() {
  const realm = await getRealm();
  try {
    // Filter all transactions with pendingUpdate = true
    const pendingTransactions = realm.objects("Transaction").filtered("pendingUpdate == true");
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
      const q = query(collection(db, "Transactions"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, "Transactions", docSnap.id);

        // Update Firestore
        await updateDoc(docRef, dataToUpdate);
        // Update Realm to clear pendingUpdate flag
        realm.write(() => {
          const txToUpdate = realm.objectForPrimaryKey("Transaction", transactionId);
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
