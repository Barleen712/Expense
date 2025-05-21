import { AddTransaction } from "../Screens/FirestoreHandler";
import { auth, db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getRealm } from "./realm";
import { uploadImage } from "../Screens/Constants";
export async function syncUnsyncedTransactions() {
  console.log("data");
  console.log("hellllo");
  console.log("dfjshdgj");
  console.log("✅ Starting sync function");
  const realm = await getRealm();
  const unsynced = realm.objects("Transaction").filtered("synced == false");
  console.log(unsynced, "trans");
  const user = auth.currentUser;
  console.log(user.uid);
  for (const txn of unsynced) {
    let supabaseImageUrl = "";
    if (txn.url) {
      supabaseImageUrl = await uploadImage(txn.url);
    }
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
      type: txn.type,
      url: supabaseImageUrl,
    };
    const success = await AddTransaction(txnData);
    console.log(success);
    if (success) {
      realm.write(() => {
        txn.synced = true;
      });
    }
  }
}
export const syncPendingDeletes = async ({ isConnected }: { isConnected: boolean }) => {
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
    const pendingTransactions = realm.objects("Transaction").filtered("pendingUpdate == true");
    for (const tx of pendingTransactions) {
      const transactionId = tx._id;

      const { _id, ...data } = tx.toJSON();
      const dataToUpdate = {
        ...data,
        synced: true,
        pendingUpdate: false,
      };
      const q = query(collection(db, "Transactions"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, "Transactions", docSnap.id);

        await updateDoc(docRef, dataToUpdate);
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
