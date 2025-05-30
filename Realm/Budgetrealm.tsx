import { getRealm } from "./realm";
import NetInfo from "@react-native-community/netinfo";
import { db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
export const markPendingDeleteOrDeleteBudget = async (realm: any, _id: string) => {
  const transaction = realm.objectForPrimaryKey("Budget", _id);

  if (!transaction) {
    console.warn("Transaction not found");
    return;
  }

  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  if (isConnected) {
    try {
      // ✅ Delete from Firestore
      const q = query(collection(db, "Budgets"), where("_id", "==", _id));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));

      await Promise.all(deletePromises);
      realm.write(() => {
        realm.delete(transaction);
      });
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      realm.close();
    }
  } else {
    // ✅ Offline: mark as pendingDelete
    realm.write(() => {
      transaction.pendingDelete = true;
    });
  }
};
export interface BudgetType {
  _id: string;
  category: string;
  amount: number;
  month: number;
  percentage: number;
  notified: boolean;
  year: number;
  notification: boolean;
  synced: boolean;
  pendingDelete: boolean;
  pendingUpdate: boolean;
}

export async function updateTransactionRealmAndFirestoreBudget(
  realm: any,
  userID: string,
  transactionId: string,
  updatedData: Partial<Omit<BudgetType, "_id">>,
  isOnline: boolean | null
) {
  try {
    if (isOnline) {
      const q = query(collection(db, "Budgets"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);
      const docSnap = querySnapshot.docs[0];
      const docRef = doc(db, "Budgets", docSnap.id);
      await updateDoc(docRef, updatedData);
      const dataToUpdate = { ...updatedData, synced: true, pendingUpdate: false };

      realm.write(() => {
        const tx = realm.objectForPrimaryKey("Budget", transactionId);
        if (tx) {
          Object.entries(dataToUpdate).forEach(([key, value]) => {
            tx[key] = value;
          });
        }
      });
      return { success: true, message: "Updated online" };
    } else {
      realm.write(() => {
        const tx = realm.objectForPrimaryKey("Budget", transactionId);
        if (tx) {
          Object.entries(updatedData).forEach(([key, value]) => {
            tx[key] = value;
          });
          tx.pendingUpdate = true;
        } else {
          realm.create("Budget", {
            _id: transactionId,
            ...updatedData,
            pendingUpdate: true,
          });
        }
      });

      return { success: true, message: "Updated offline - pending sync" };
    }
  } catch (error) {
    console.error("Failed to update transaction:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: errorMessage };
  }
}

export const retrieveOldTransactions = async () => {
  try {
    const realm = await getRealm();
    if (!realm) {
      console.error("Realm instance is undefined");
      return;
    }
    const transactions = realm.objects("Budget");
    console.log(transactions, "dhj");
  } catch (error) {
    console.error("Error opening Realm:", error);
  }
};
export const saveToRealmBudgets = async (input: any) => {
  const realm = await getRealm();
  const transactions = Array.isArray(input) ? input : [input];
  if (!realm) {
    console.error("Realm instance is undefined");
    return;
  }
  realm.write(() => {
    transactions.forEach((txn) => {
      const exists = realm.objectForPrimaryKey("Budget", txn._id);
      if (!exists) {
        const safeTxn = {
          ...txn,
          synced: true,
          pendingDelete: false,
        };

        try {
          realm.create("Budget", safeTxn);
        } catch (e) {
          console.error("Failed to write transaction:", txn._id, e);
        }
      } else {
        return;
      }
    });
  });
};
