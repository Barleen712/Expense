// src/database/realm.js
import Realm, { type Configuration } from "realm";
import { BudgetSchema, TransactionSchema } from "./Schema";
import { uploadImage } from "../Screens/Constants";
import NetInfo from "@react-native-community/netinfo";
import { db } from "../Screens/FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

let realm: Realm | null = null;

export const getRealm = async (): Promise<Realm | undefined> => {
  try {
    if (realm && !realm.isClosed) {
      return realm;
    }
    // realm doesn't exist or was closed, open a new one
    const config: Configuration = {
      schema: [TransactionSchema, BudgetSchema],
      schemaVersion: 7,
    };
    realm = await Realm.open(config);
    return realm;
  } catch (error) {
    console.log(error);
  }
};
export const deleteRealmDatabase = async () => {
  try {
    Realm.deleteFile({ path: Realm.defaultPath });
  } catch (error) {
    console.error("❌ Failed to delete Realm file:", error);
  }
};

export const markPendingDeleteOrDelete = async (realm: any, _id: string) => {
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

export const saveToRealmIfNotExists = async (input: any) => {
  const realm = await getRealm();
  const transactions = Array.isArray(input) ? input : [input];
  if (!realm) {
    console.error("Realm instance is undefined.");
    return;
  }
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
interface TransType {
  _id: string;
  amount: number;
  description: string;
  category: string;
  wallet: string;
  moneyCategory: string;
  url: string;
  Frequency: string;
  endAfter: string | null;
  weekly: string;
  repeat: boolean;
  startDate: number;
  startMonth: number;
  startYear: number;
  endDate: string | null;
  synced: boolean;
  pendingUpdate: boolean;
  type: SVGStringList;
}

export async function updateTransactionRealmAndFirestore(
  realm: Realm,
  userID: string,
  transactionId: string,
  updatedData: Partial<Omit<TransType, "_id">>,
  isOnline: boolean | null
) {
  try {
    if (isOnline) {
      let supabaseurl = null;

      const isRemoteUrl = (url: string) => {
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
        type: updatedData.type,
      };
      console.log(Data);
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
  } catch (error: any) {
    console.error("Failed to update transaction:", error);
    return { success: false, message: error.message };
  }
}
