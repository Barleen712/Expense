import { getRealm } from "./realm";
import { auth, db } from "../Screens/FirebaseConfig";
import { AddBudget } from "../Screens/FirestoreHandler";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
export async function syncUnsyncedBudget() {
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

    const success = await AddBudget(budgetData);
    console.log(success);
    if (success) {
      try {
        realm.write(() => {
          txn.synced = true;
        });
      } catch (error) {
        console.log(error);
      }
      console.log("done");
    }
  }
}
export const syncPendingDeletesBudget = async ({ isConnected }) => {
  if (!isConnected) return;
  const realm = await getRealm();
  const pendingDeletes = realm.objects("Budget").filtered("pendingDelete == true");
  for (const budget of pendingDeletes) {
    try {
      const q = query(collection(db, "Budgets"), where("_id", "==", budget._id));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
      await Promise.all(deletePromises);

      realm.write(() => {
        realm.delete(budget);
      });
    } catch (error) {
      console.error(`❌ Error syncing/deleting transaction ${budget._id}:`, error);
    }
  }
};
export async function syncPendingUpdatesToFirestoreBudgets() {
  const realm = await getRealm();
  try {
    // Filter all transactions with pendingUpdate = true
    const pendingBudgets = realm.objects("Budget").filtered("pendingUpdate == true");
    for (const tx of pendingBudgets) {
      const budgetId = tx._id;

      // Prepare the data (omit internal Realm metadata)
      const { _id, ...data } = tx.toJSON();
      const dataToUpdate = {
        ...data,
        synced: true,
        pendingUpdate: false,
      };

      // Query Firestore to find document with matching _id
      const q = query(collection(db, "Budgets"), where("_id", "==", budgetId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, "Budgets", docSnap.id);

        // Update Firestore
        await updateDoc(docRef, dataToUpdate);
        // Update Realm to clear pendingUpdate flag
        realm.write(() => {
          const Update = realm.objectForPrimaryKey("Budget", budgetId);
          if (Update) {
            Update.synced = true;
            Update.pendingUpdate = false;
          }
        });
      } else {
        console.warn(`No Firestore transaction found for _id: ${budgetId}`);
      }
    }

    return { success: true, message: "All pending updates synced" };
  } catch (error) {
    console.error("Error syncing transactions:", error);
    return { success: false, message: error.message };
  }
}
