import { addDoc } from "firebase/firestore";
import { db, auth } from "./FirebaseConfig";
import { collection, query, getDocs, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
export async function AddTransaction(transactionData) {
  try {
    const docRef = await addDoc(collection(db, "Transactions"), transactionData);
    console.log("added");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function AddBudget(budgetData) {
  try {
    await addDoc(collection(db, "Budgets"), budgetData);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export async function AddNotification(notificationData) {
  try {
    await addDoc(collection(db, "Notification"), notificationData);
  } catch (e) {
    console.log(e);
  }
}
export async function AddUser(name) {
  try {
    await addDoc(collection(db, "Names"), name);
  } catch (e) {
    console.log(e);
  }
}
export async function AddPin(pinData) {
  try {
    await addDoc(collection(db, "Pins"), pinData);
  } catch (e) {
    console.log(e);
  }
}
export const deleteDocument = async (collection: string, id: string) => {
  await deleteDoc(doc(db, collection, id));
};
export const deleteAllUserNotifications = async (userId) => {
  try {
    const q = query(collection(db, "Notification"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
};
export const updateDocument = async (collection: string, id: string, data) => {
  const userRef = doc(db, collection, id);
  await updateDoc(userRef, {
    amount: data.amount,
    category: data.category,
    description: data.description,
    wallet: data.wallet,
  });
};
export const updateBudgetDocument = async (collection: string, id: string, data) => {
  const userRef = doc(db, collection, id);
  await updateDoc(userRef, {
    amount: data.amount,
    category: data.category,
    notification: data.noti,
    percentage: data.percentage,
    notified: data.notified,
  });
};
export const updateUserDoc = async (id: string, data) => {
  const userRef = doc(db, "Names", id);
  const d = await updateDoc(userRef, data);
};
