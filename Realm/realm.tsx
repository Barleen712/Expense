// src/database/realm.js
import Realm from "realm";
import { TransactionSchema } from "./Schema";

let realm;

export const getRealm = async () => {
    try{
        if (!realm) {
            console.log("wehfuh")
            realm = await Realm.open({
              schema: [TransactionSchema],
              schemaVersion: 1, 
            });
        }
        return realm
    }
    catch(error)
    {
        console.log(error)
    }
};
