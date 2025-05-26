// src/database/realm.js
import Realm from "realm";
import { BudgetSchema, TransactionSchema } from "./Schema";
import { uploadImage } from "../Screens/Constants";

let realm;

export const getRealm = async () => {
  try {
    if (realm && !realm.isClosed) {
      return realm;
    }
    // realm doesn't exist or was closed, open a new one
    realm = await Realm.open({
      schema: [TransactionSchema, BudgetSchema],
      schemaVersion: 5,
    });
    return realm;
  } catch (error) {
    console.log(error);
  }
};

// export const retrieveOldTransactions = async () => {
//   try {
//     const realm = await Realm.open({
//       schema: [TransactionSchema],
//       schemaVersion: 1, // old version
//     });

//     const transactions = realm.objects("Transaction");
//     console.log(transactions, "dhj");
//   } catch (error) {
//     console.error("Error opening Realm:", error);
//   }
// };
export const deleteRealmDatabase = async () => {
  try {
    Realm.deleteFile({ path: Realm.defaultPath });
  } catch (error) {
    console.error("❌ Failed to delete Realm file:", error);
  }
};

import NetInfo from "@react-native-community/netinfo";
import { db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
export const markPendingDeleteOrDelete = async (realm, _id) => {
  const transaction = realm.objectForPrimaryKey("Transaction", _id);

  if (!transaction) {
    console.warn("Transaction not found");
    return;
  }

  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  if (isConnected) {
    try {
      // ✅ Delete from Firestore
      const q = query(collection(db, "Transactions"), where("_id", "==", _id));
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

export const saveToRealmIfNotExists = async (input) => {
  const realm = await getRealm();
  const transactions = Array.isArray(input) ? input : [input];
  realm.write(() => {
    transactions.forEach((txn) => {
      const exists = realm.objectForPrimaryKey("Transaction", txn._id);
      if (!exists) {
        const safeTxn = {
          ...txn,
          synced: true,
          pendingDelete: false,
        };

        try {
          realm.create("Transaction", safeTxn);
        } catch (e) {
          console.error("Failed to write transaction:", txn._id, e);
        }
      } else {
        return;
      }
    });
  });
};
export async function updateTransactionRealmAndFirestore(
  realm: Realm,
  userID: string,
  transactionId: string,
  updatedData: Partial<Omit<typeof TransactionSchema.properties, "_id">>,
  isOnline: boolean
) {
  try {
    if (isOnline) {
      let supabaseurl = null;

      const isRemoteUrl = (url) => {
        return url.startsWith("http://") || url.startsWith("https://");
      };

      if (updatedData.url) {
        if (isRemoteUrl(updatedData.url)) {
          // Already remote URL, no upload needed
          supabaseurl = updatedData.url;
        } else {
          // Local URI, upload image
          supabaseurl = await uploadImage(updatedData.url);
        }
      }
      const Data = {
        amount: updatedData.amount,
        description: updatedData.description,
        category: updatedData.category,
        wallet: updatedData.wallet,
        moneyCategory: updatedData.moneyCategory,
        url: supabaseurl,
        Frequency: updatedData.Frequency,
        weekly: updatedData.weekly,
        repeat: updatedData.repeat,
        startDate: updatedData.startDate,
        startMonth: updatedData.startMonth,
        startYear: updatedData.startYear,
        endAfter: updatedData.endAfter,
        endDate: updatedData.endDate,
      };
      const q = query(collection(db, "Transactions"), where("_id", "==", transactionId));
      const querySnapshot = await getDocs(q);
      const docSnap = querySnapshot.docs[0];
      const docRef = doc(db, "Transactions", docSnap.id);
      await updateDoc(docRef, Data);
      const dataToUpdate = { ...updatedData, synced: true, pendingUpdate: false };

      // Update Realm
      realm.write(() => {
        const tx = realm.objectForPrimaryKey("Transaction", transactionId);
        if (tx) {
          Object.entries(dataToUpdate).forEach(([key, value]) => {
            (tx as any)[key] = value;
          });
        }
      });
      console.log("updated in databse");
      return { success: true, message: "Updated online" };
    } else {
      realm.write(() => {
        const tx = realm.objectForPrimaryKey("Transaction", transactionId);
        if (tx) {
          Object.entries(updatedData).forEach(([key, value]) => {
            (tx as any)[key] = value;
          });
          tx.pendingUpdate = true;
        } else {
          realm.create("Transaction", {
            _id: transactionId,
            ...updatedData,
            pendingUpdate: true,
          });
        }
        console.log("updated offline");
      });

      return { success: true, message: "Updated offline - pending sync" };
    }
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return { success: false, message: error.message };
  }
}
