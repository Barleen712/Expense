// src/database/realm.js
import Realm from "realm";
import { TransactionSchema } from "./Schema";

let realm;

export const getRealm = async () => {
  try {
    if (!realm) {
      realm = await Realm.open({
        schema: [TransactionSchema],
        schemaVersion: 1,
      });
    }
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
    transactions.forEach((tx) => {
      console.log(`ID: ${tx._id}, Start Date: ${tx.startDate}`);
    });
    realm.close();
  } catch (error) {
    console.error("Error opening Realm:", error);
  }
};
// export const deleteRealmDatabase = async () => {
//   try {
//     Realm.deleteFile({ path: Realm.defaultPath });
//     console.log("✅ Realm file deleted");
//   } catch (error) {
//     console.error("❌ Failed to delete Realm file:", error);
//   }
// };
