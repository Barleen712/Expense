import Realm from "realm";
import { AddTransaction } from "../Screens/FirestoreHandler";
import { TransactionSchema } from "./Schema"; // adjust path
import { auth } from "../Screens/FirebaseConfig";
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
