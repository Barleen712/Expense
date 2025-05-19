// src/database/realm.js
import Realm from "realm";
import { TransactionSchema } from "./Schema";

let realm;

export const getRealm = async () => {
  try {
    if (realm && !realm.isClosed) {
      return realm;
    }
    // realm doesn't exist or was closed, open a new one
    realm = await Realm.open({
      schema: [TransactionSchema],
      schemaVersion: 1,
    });
    return realm;
  } catch (error) {
    console.log(error);
  }
};

export const retrieveOldTransactions = async () => {
  try {
    const realm = await Realm.open({
      schema: [TransactionSchema],
      schemaVersion: 1, // old version
    });

    const transactions = realm.objects("Transaction");
    console.log(transactions);
  } catch (error) {
    console.error("Error opening Realm:", error);
  }
};
export const deleteRealmDatabase = async () => {
  try {
    Realm.deleteFile({ path: Realm.defaultPath });
    console.log("✅ Realm file deleted");
  } catch (error) {
    console.error("❌ Failed to delete Realm file:", error);
  }
};
// import { addTransaction } from "../Slice/IncomeSlice";

// export const loadTransactionsFromRealm = async (dispatch) => {
//   const realm = await getRealm();
//   const realmTransactions = realm.objects("Transaction");
//   const transactions = realmTransactions.map((tx) => ({
//     _id: tx._id,
//     amount: tx.amount,
//     description: tx.description,
//     category: tx.category,
//     wallet: tx.wallet,
//     moneyCategory: tx.moneyCategory,
//     Frequency: tx.Frequency,
//     endAfter: tx.endAfter,
//     weekly: tx.weekly,
//     endDate: tx.endDate,
//     repeat: tx.repeat,
//     startDate: tx.startDate,
//     startMonth: tx.startMonth,
//     startYear: tx.startYear,
//     Date: tx.Date,
//     synced: tx.synced,
//   }));
//   dispatch(addTransaction(transactions));
// };
import NetInfo from "@react-native-community/netinfo";
import { db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
export const markPendingDeleteOrDelete = async (realm, _id) => {
  console.log(_id);
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

      console.log("Transaction deleted from Firestore & Realm");
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

    console.log("Marked transaction as pendingDelete");
  }
};

export const syncPendingDeletes = async () => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);
  if (!isConnected) return;
  console.log("dsfkj");
  const realm = await getRealm();
  const pendingDeletes = realm.objects("Transaction").filtered("pendingDelete == true");
  console.log(pendingDeletes, "fjhg");
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
export const saveToRealmIfNotExists = async (transactions) => {
  const realm = await getRealm();
  realm.write(() => {
    transactions.forEach((txn) => {
      const exists = realm.objectForPrimaryKey("Transaction", txn._id);
      if (!exists) {
        realm.create("Transaction", {
          ...txn,
          synced: true,
          pendingDelete: false,
        });
      }
    });
  });

  realm.close();
};
