import { getRealm } from "./realm";
import NetInfo from "@react-native-community/netinfo";
import { db, auth } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { generateKey, encryptData } from "../Encryption/encrption";

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

const applyUpdatesToRealmObject = (obj: any, updates: object) => {
  Object.entries(updates).forEach(([key, value]) => {
    obj[key] = value;
  });
};

const getFirestoreDocByBudgetId = async (_id: string) => {
  const q = query(collection(db, "Budgets"), where("_id", "==", _id));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0] ?? null;
};

export const markPendingDeleteOrDeleteBudget = async (_id: string) => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);
  const realm = await getRealm();
  const budget = realm.objectForPrimaryKey("Budget", _id);
  if (!budget) {
    console.warn("Budget not found");
    return;
  }

  if (isConnected) {
    try {
      const docSnap = await getFirestoreDocByBudgetId(_id);
      if (docSnap) {
        await deleteDoc(docSnap.ref);
      }

      realm.write(() => {
        realm.delete(budget);
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  } else {
    // Offline: mark for deletion
    realm.write(() => {
      budget.pendingDelete = true;
    });
  }
};

export async function updateTransactionRealmAndFirestoreBudget(
  transactionId: string,
  updatedData: Partial<Omit<BudgetType, "_id">>,
  isOnline: boolean | null
) {
  const realm = await getRealm();
  const user = auth.currentUser;
  try {
    const tx = realm.objectForPrimaryKey("Budget", transactionId);

    if (isOnline) {
      const docSnap = await getFirestoreDocByBudgetId(transactionId);
      if (docSnap) {
        const docRef = doc(db, "Budgets", docSnap.id);
        const key = await generateKey(user.uid, user?.providerId, 5000, 256);
        const encryptedData = await encryptData(JSON.stringify(updatedData), key);
        const Data = {
          _id: transactionId,
          encryptedData,
          userId: user.uid,
        };

        await updateDoc(docRef, Data);
      }

      realm.write(() => {
        if (tx) {
          applyUpdatesToRealmObject(tx, {
            ...updatedData,
            synced: true,
            pendingUpdate: false,
          });
        }
      });
    } else {
      realm.write(() => {
        if (tx) {
          applyUpdatesToRealmObject(tx, { ...updatedData, pendingUpdate: true });
        } else {
          realm.create("Budget", {
            _id: transactionId,
            ...updatedData,
            pendingUpdate: true,
          });
        }
      });
    }

    return {
      success: true,
      message: isOnline ? "Updated online" : "Updated offline - pending sync",
    };
  } catch (error) {
    console.error("Failed to update budget:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: errorMessage };
  }
}

export const saveToRealmBudgets = async (input: BudgetType | BudgetType[]) => {
  const transactions = Array.isArray(input) ? input : [input];
  const realm = await getRealm();

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
          console.error("Failed to write budget:", txn._id, e);
        }
      }
    });
  });
};
