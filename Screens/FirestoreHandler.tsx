import { encryptData, generateKey, decryptData } from "../Encryption/encrption";
import { db, auth } from "./FirebaseConfig";
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
export async function AddTransaction(transactionData: any) {
  console.log(transactionData);
  try {
    const docRef = await addDoc(collection(db, "Transactions"), transactionData);
    console.log(docRef);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function AddBudget(budgetData: any) {
  try {
    await addDoc(collection(db, "Budgets"), budgetData);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export async function AddNotification(notificationData: any) {
  try {
    await addDoc(collection(db, "Notification"), notificationData);
  } catch (e) {
    console.log(e);
  }
}
export async function AddUser(name: any) {
  try {
    await addDoc(collection(db, "Names"), name);
  } catch (e) {
    console.log(e);
  }
}
export async function AddPin(pinData: any) {
  try {
    await addDoc(collection(db, "Pins"), pinData);
  } catch (e) {
    console.log(e);
  }
}
export const deleteDocument = async (collection: string, id: string) => {
  await deleteDoc(doc(db, collection, id));
};
export const deleteAllUserNotifications = async (userId: string) => {
  try {
    const q = query(collection(db, "Notification"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
};
export const updateDocument = async (collection: string, id: string, data: any) => {
  const userRef = doc(db, collection, id);
  await updateDoc(userRef, {
    amount: data.amount,
    category: data.category,
    description: data.description,
    wallet: data.wallet,
  });
};
export const updateBudgetDocument = async (collection: string, id: string, data: any) => {
  const userRef = doc(db, collection, id);
  await updateDoc(userRef, {
    amount: data.amount,
    category: data.category,
    notification: data.noti,
    percentage: data.percentage,
    notified: data.notified,
  });
};
export const updateUserDoc = async (id: string, data: any) => {
  const q = query(collection(db, "Names"), where("userid", "==", id));
  const snapshot = await getDocs(q);
  const docRef = snapshot.docs[0].ref;
  console.log(docRef);
  try {
    const updateData = { ...data };
    delete updateData.userId;
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.log(error);
  }
};
export const updateNotification = async (userId: string) => {
  try {
    const q = query(collection(db, "Notification"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const key = await generateKey(userId, auth.currentUser?.providerId, 5000, 256);

    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const docData = docSnap.data();

      // Decrypt encryptedData string
      const decryptedJsonStr = await decryptData(docData.encryptedData.cipher, key, docData.encryptedData.iv);
      const notif = JSON.parse(decryptedJsonStr);

      // Update read field
      const updatedNotif = { ...notif, read: true };

      // Encrypt updated notification again
      const encryptedData = await encryptData(JSON.stringify(updatedNotif), key);

      const notifRef = doc(db, "Notification", docSnap.id);

      // Update Firestore with new encryptedData
      return updateDoc(notifRef, {
        encryptedData,
        userId,
        date: updatedNotif.date,
      });
    });

    await Promise.all(updatePromises);
    console.log("✅ All notifications decrypted, updated and re-encrypted in Firestore.");
  } catch (error) {
    console.error("❌ Error updating notifications:", error);
  }
};
