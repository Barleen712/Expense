import { AddTransaction } from "../Screens/FirestoreHandler";
import { auth, db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getRealm } from "./realm";
import { uploadImage } from "../Screens/Constants";
import { generateKey, encryptData } from "../Encryption/encrption";
export async function syncUnsyncedTransactions() {
  const realm = await getRealm();
  const unsynced = realm.objects("Transaction").filtered("synced == false");
  const user = auth.currentUser;
  for (const txn of unsynced) {
    let supabaseImageUrl = null;
    if (txn.url) {
      supabaseImageUrl = await uploadImage(txn.url);
    }
    // const key = await generateKey(user?.uid, user?.providerId, 5000, 256);
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
      weekly: txn.weekly,
    };
    // const encryptedData = await encryptData(JSON.stringify(txnData), key);
    // console.log(encryptedData);
    const success = await AddTransaction(txnData);
    console.log(success);
    if (success) {
      realm.write(() => {
        txn.synced = true;
      });
    }
  }
}
export const syncPendingDeletes = async ({ isConnected }: { isConnected: boolean | null }) => {
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
      const q = query(collection(db, "Transactions"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, "Transactions", docSnap.id);
        let supabaseurl = null;

        const isRemoteUrl = (url: string) => {
          return url.startsWith("http://") || url.startsWith("https://");
        };

        if (tx.url && typeof tx.url === "string") {
          if (isRemoteUrl(tx.url)) {
            // Already remote URL, no upload needed
            supabaseurl = tx.url;
          } else {
            // Local URI, upload image
            supabaseurl = await uploadImage(tx.url);
            console.log(supabaseurl);
          }
        }
        console.log(tx);
        const Data = {
          amount: tx.amount,
          description: tx.description,
          category: tx.category,
          wallet: tx.wallet,
          moneyCategory: tx.moneyCategory,
          url: supabaseurl,
          Frequency: tx.Frequency,
          weekly: tx.weekly,
          repeat: tx.repeat,
          startDate: tx.startDate,
          startMonth: tx.startMonth,
          startYear: tx.startYear,
          endAfter: tx.endAfter,
          endDate: tx.endDate,
        };
        await updateDoc(docRef, Data);
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
