import { Platform } from "react-native";
import { supabase } from "./SuperbaseConfig";
import RNFS from "react-native-fs";
import ReactNativeBiometrics, { FaceID } from "react-native-biometrics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const rnBiometrics = new ReactNativeBiometrics();
export const categoryMap = {
  Food: require("../assets/Food.png"),
  Shopping: require("../assets/Shopping.png"),
  Subscription: require("../assets/Subscription.png"),
  Miscellaneous: require("../assets/Miscellaneous.png"),
  Entertainment: require("../assets/Entertainment.png"),
  Transportation: require("../assets/Transportation.png"),
  Bills: require("../assets/Bills.png"),
  Transfer: require("../assets/Transfer.png"),
  Salary: require("../assets/Salary.png"),
  "Passive Income": require("../assets/Passive Income.png"),
};
export const Food = "../assets/Food.png";
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
export const Weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
export const StringConstants = {
  GetStarted: "Get Started",
  Gaintotalcontrolofyourmoney: "Gain total control of your money",
  Knowwhereyourmoneygoes: "Know where your money goes",
  Planningahead: "Planning ahead",
  Becomeyourownmoneymanagerandmakeeverycentcount: "Become your own money manager and make every cent count",
  Trackyourtransactioneasilywithcategoriesandfinancialreport:
    "Track your transaction easily,with categories and financial report",
  Setupyourbudgetforeachcategorysoyouincontrol: "Setup your budget for each category so you in control",
  SignUp: "Sign Up",
  Login: "Login",
  Name: "Name",
  Email: "Email",
  Password: "Password",
  Bysigningupyouagreetothe: "By signing up, you agree to the ",
  TermsofServiceandPrivacyPolicy: "Terms of Service and Privacy Policy",
  orwith: "or with",
  SignUpwithGoogle: "Sign Up with Google",
  Alreadyhaveanaccount: "Already have an account?",
  ForgotPassword: "Forgot Password",
  Donthaveanaccountyet: "Don’t have an account yet?",
  Income: "Income",
  Expense: "Expense",
  Language: "Language",
  SpendSmarter: "Spend Smarter Save More",
  LetssetupyouPin: "Let’s setup you Pin",
  OkRetypeyourPinagain: "Ok. Re type your Pin again",
  Youareset: "You are set",
  AccountBalance: "Account Balance",
  SpendFrequency: "Spend Frequency",
  Today: "Today",
  Week: "Week",
  Month: "Month",
  Year: "Year",
  RecentTransaction: "Recent Transaction",
  SeeAll: "See All",
  DontWorry: "Don’t Worry",
  Enteryouremail: "Enter your email and we’ll send you a link to reset your password",
  Continue: "Continue",
  Youremailisontheway: "Your email is on the way",
  Checkyouremail: "Check your email test@test.com and follow the instructions to reset your password",
  BacktoLogin: "Back to Login",
  Home: "Home",
  Transactions: "Transactions",
  Budget: "Budget",
  Profile: "Profile",
  Seeyourfinancialreport: "See your financial report",
  Account: "Account",
  Settings: "Settings",
  ExportData: "Export Data",
  Logout: "Logout",
  Currency: "Currency",
  Theme: "Theme",
  Security: "Security",
  Notification: "Notification",
  About: "About",
  Help: "Help",
  Howmuch: "How much?",
  Category: "Category",
  Description: "Description",
  Wallet: "Wallet",
  Addattachment: "Add attachment",
  CreateaBudget: "Create a Budget",
  FilterTransaction: "Filter Transaction",
  FilterBy: "Filter By",
  Transfer: "Transfer",
  SortBy: "Sort By",
  ChooseCategory: "Choose Category",
  RepeatTransaction: "Repeat Transaction",
  Youdonthaveabudget: "You don’t have a budget",
  Letmake: "Let’s make one so you in control",
  FaceID: "Face ID",
  Usingdevicetheme: "Using device theme",
  PassiveSalary: "Passive Salary",
  Removethistransaction: "Remove this transaction",
  Areyousure: "Are you sure you want to remove this transaction?",
  Transactionhasbeensuccessfully: "Transaction has been successfully removed",
  Financialfreedon: "Financial freedom is freedom from fear",
  RobertKiyosaki: "Robert Kiyosaki",
  Seethefulldetail: "See the full detail",
  Budgetisexceedsthelimit: "Budget is exceeds the limit",
  FinancialReport: "Financial Report",
  CreateBudget: "Create Budget",
  RecieveAlert: "Recieve Alert",
  Receivealertwhenitreachessomepoint: "Receive alert when it reaches some point",
  DetailBudget: "Detail Budget",
};
export const currencies: Record<string, string> = {
  USD: "$",
  GBP: "£",
  CAD: "$",
  INR: "₹",
  AUD: "$",
  RUB: "₽",
};
export const handleBiometricAuth = async (navigation: any) => {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      navigation.navigate("EnterPin");
      return;
    }

    const biometricEnabled = await AsyncStorage.getItem("biometricEnabled");
    if (biometricEnabled === null) {
      Alert.alert("Enable Biometric Login?", "Would you like to use fingerprint/face recognition to log in?", [
        {
          text: "No",
          onPress: async () => {
            await AsyncStorage.setItem("biometricEnabled", "false");
            navigation.navigate("EnterPin");
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.setItem("biometricEnabled", "true");
            const { success } = await rnBiometrics.simplePrompt({
              promptMessage: "Confirm your identity",
              cancelButtonText: "Use PIN Instead",
            });

            if (success) {
              navigation.navigate("MainScreen");
            } else {
              navigation.navigate("EnterPin");
            }
          },
        },
      ]);
    } else if (biometricEnabled === "true") {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: "Confirm your identity",
        cancelButtonText: "Use PIN Instead",
      });

      if (success) {
        navigation.navigate("MainScreen");
      } else {
        navigation.navigate("EnterPin");
      }
    } else {
      navigation.navigate("EnterPin");
    }
  } catch (error) {
    console.error("Biometric error:", error);
    navigation.navigate("EnterPin");
  }
};

export const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return {
      id: tokens.idToken,
      name: userInfo.data?.user.name,
      photo: userInfo.data?.user.photo,
    };
    // const googleCredential = GoogleAuthProvider.credential(tokens.idToken);
    // const creds = await signInWithCredential(auth, googleCredential);
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    Alert.alert("Error", error.message || "Google Sign-In failed");
  }
};
export const profilepics = [
  require("../assets/women3.jpg"),
  require("../assets/man1.jpg"),
  require("../assets/Women2.jpg"),
  require("../assets/man2.jpg"),
  require("../assets/women1.jpg"),
];
export const FirebaseErrors: Record<string, string> = {
  "auth/invalid-credential": "Check Your Credentials",
  "auth/too-many-requests": "You have exceeded the request limit",
  "auth/email-already-in-use": "The provided email is already in use",
};
export function raiseToast(text1: string, error: string) {
  Toast.show({
    type: "error",
    text1: text1,
    text2: FirebaseErrors[error],
    position: "bottom",
    text1Style: { fontSize: 16 },
    text2Style: { fontSize: 16, fontWeight: "bold" },
  });
}
