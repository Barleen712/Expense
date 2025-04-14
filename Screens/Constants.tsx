import { Platform } from "react-native";
import { supabase } from "./SuperbaseConfig";
import RNFS from "react-native-fs";
export const categoryMap = {
  Food: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Food.png"),
  Shopping: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Shopping.png"),
  Subscription: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Subscription.png"),
  Miscellaneous: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Miscellaneous.png"),
  Entertainment: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Entertainment.png"),
  Transportation: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Transportation.png"),
  Bills: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Bills.png"),
  Transfer: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Transfer.png"),
  Salary: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Salary.png"),
  "Passive Income": require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Passive Income.png"),
};
export const Month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "rgba(253, 60, 74, 1)",
  Transport: "yellow",
  Shopping: "rgba(252, 172, 18, 1)",
  Entertainment: "#6CCACF",
  Subscription: "rgba(127, 61, 255, 1)",
  Transportation: "#CC7400",
  Transfer: "rgba(0, 119, 255, 1)",
  Bills: "purple",
  Miscellaneous: "#2A7C6C",
  Salary: "rgba(0, 168, 107, 1)",
  "Passive Income": "rgba(13, 14, 15, 1)",
};
export const uploadImage = async (imageUri: string) => {
  try {
    if (!imageUri) {
      console.warn("No image URI to upload.");
      return null;
    }
    const fileName = imageUri.split("/").pop() || `income_${Date.now()}.jpg`;
    const filePath = `income-images/${fileName}`;
    let base64Image: string | null = null;

    // Convert image to Base64 (web or native)
    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64Image = await new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]);
          } else {
            reject("Failed to read as Data URL");
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      base64Image = await RNFS.readFile(imageUri, "base64");
    }

    if (!base64Image) {
      throw new Error("Failed to convert image to Base64");
    }
    const binaryString = atob(base64Image);
    const fileArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      fileArray[i] = binaryString.charCodeAt(i);
    }
    const { data, error: uploadError } = await supabase.storage.from("expense-tracker").upload(filePath, fileArray, {
      contentType: "image/jpeg", // Removed dynamic part for simplicity
      upsert: true,
    });
    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return null;
    }
    const { data: urlData } = supabase.storage.from("expense-tracker").getPublicUrl(filePath); // Use same bucket
    if (!urlData.publicUrl) {
      throw new Error("Failed to retrieve public URL");
    }
    return urlData.publicUrl;
  } catch (e) {
    console.error("Image upload error:", e);
    return null;
  }
};
export const WalletMap: Record<string, string> = {
  PayPal: require("../assets/paypal.png"),
  Paytm: require("../assets/paytm.png"),
  "Google Pay": require("../assets/gpay.png"),
  PhonePe: require("../assets/phonePe.png"),
  "Apple Pay": require("../assets/apple-pay.png"),
};
