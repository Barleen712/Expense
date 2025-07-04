import { Platform, Alert, PermissionsAndroid } from "react-native";
import { supabase } from "./SuperbaseConfig";
import RNFS from "react-native-fs";
import ReactNativeBiometrics from "react-native-biometrics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const rnBiometrics = new ReactNativeBiometrics();
import Food from "../assets/food.svg";
import Shopping from "../assets/shopping.svg";
import Subscription from "../assets/subscription.svg";
import Miscellaneous from "../assets/miscellaneous.svg";
import Entertainment from "../assets/entertainment.svg";
import Transportation from "../assets/transportation.svg";
import Bills from "../assets/bills.svg";
import Transfer from "../assets/transfer.svg";
import Salary from "../assets/salary.svg";
import PassiveIncome from "../assets/passive.svg"; // if name has space
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { check, request, openSettings, PERMISSIONS, RESULTS } from "react-native-permissions";
import { decode as base64Decode } from "base64-arraybuffer";
export const categoryMap = {
  Food,
  Shopping,
  Subscription,
  Miscellaneous,
  Entertainment,
  Transportation,
  Bills,
  Transfer,
  Salary,
  "Passive Income": PassiveIncome,
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
  "Passive Income": "rgb(231, 199, 14)",
};

export const uploadImage = async (imageUri: string) => {
  try {
    if (!imageUri) {
      console.warn("No image URI to upload.");
      return null;
    }

    const fileName = imageUri.split("/").pop() ?? `income_${Date.now()}.jpg`;
    const filePath = `income-images/${fileName}`;
    let base64Image: string | null = null;

    if (Platform.OS === "web") {
      // Web: convert image URL to base64 using fetch
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64Image = await new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]); // Strip data:image/...;base64,
          } else {
            reject(new Error("Failed to read image data"));
          }
        };
        reader.onerror = () => reject(new Error("FileReader failed"));
        reader.readAsDataURL(blob);
      });
    } else {
      // Native: read file as base64
      base64Image = await RNFS.readFile(imageUri, "base64");
    }

    if (!base64Image) {
      throw new Error("Failed to convert image to Base64");
    }

    const fileArray = new Uint8Array(base64Decode(base64Image));

    const { error: uploadError } = await supabase.storage.from("expense-tracker").upload(filePath, fileArray, {
      contentType: "image/jpeg", // optional but recommended
      upsert: true,
    });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage.from("expense-tracker").getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
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
  orwith: "Or with",
  SignUpwithGoogle: "Sign Up with Google",
  Alreadyhaveanaccount: "Already Have Account?",
  ForgotPassword: "Forgot Password",
  Donthaveanaccountyet: "Don’t have an account yet?",
  Income: "Income",
  Expense: "Expense",
  Language: "Language",
  SpendSmarter: "Spend Smarter Save More",
  LetssetupyouPin: "Let’s setup you Pin",
  OkRetypeyourPinagain: "Re type your Pin again",
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
  RecieveAlert: "Receive Alert",
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
    console.log(available);
    if (!available) {
      navigation.navigate("EnterPin");
      return;
    }

    const biometricEnabled = await AsyncStorage.getItem("biometricEnabled");

    if (biometricEnabled === null) {
      Alert.alert("Enable Biometric Login?", "Would you like to use fingerprint/face recognition to log in?", [
        {
          text: "No",
          onPress: () => {
            AsyncStorage.setItem("biometricEnabled", "false").then(() => {
              navigation.navigate("EnterPin");
            });
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            (async () => {
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
            })();
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
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
  }
};
const pics = {
  0: require("../assets/women3.jpg"),
  1: require("../assets/man1.jpg"),
  2: require("../assets/Women2.jpg"),
  3: require("../assets/man2.jpg"),
  4: require("../assets/women1.jpg"),
};
export const profilepics = [pics[0], pics[1], pics[2], pics[3], pics[4]];

export const FirebaseErrors: Record<string, string> = {
  "auth/invalid-credential": " ⚠️ Check Your Credentials",
  "auth/too-many-requests": " ⚠️ You have exceeded the request limit",
  "auth/email-already-in-use": "🚫 The provided email is already in use",
  "auth/network-request-failed": "🚫 No internet. Please reconnect and try again.",
  done: " ✅ You have successfully registered",
  verify: "📧 Please check your inbox to verify your email.",
  fail: "⚠️ Email not verified. Please check your inbox.",
  login: "✅ You have successfully logged in ",
  "no-data": "⚠️ Sign Up Failed",
};
export function raiseToast(type: string, text1: string, error: string) {
  Toast.show({
    type: type,
    text1: text1,
    text2: FirebaseErrors[error],
    position: "top",
    topOffset: 100,
    text1Style: { fontSize: 16 },
    text2Style: { fontSize: 12, fontWeight: "bold" },
    autoHide: true,
    visibilityTime: 5000,
    swipeable: true,
  });
}
export const Terms_Conditions = [
  {
    count: "1. ",
    title: "Use of the App",
    description:
      "You must be at least 13 years old (or the minimum age required in your jurisdiction) to use the App. By using the App, you represent that you meet this requirement. You agree to use the App only for lawful purposes and in accordance with these Terms.",
  },
  {
    count: "2. ",
    title: "Account Registration",
    description:
      "To use certain features, you may need to create an account. You agree to provide accurate, current, and complete information and to keep it updated. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
  },
  {
    count: "3. ",
    title: "Privacy",
    description:
      "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and safeguard your information.",
  },
  {
    count: "4. ",
    title: "Data Accuracy and Responsibility",
    description:
      "The App provides tools to track expenses and budgets, but you are solely responsible for the accuracy of the data you input. We do not guarantee financial outcomes or provide financial advice.",
  },
  {
    count: "5. ",
    title: "Intellectual Property",
    description:
      "The App and its content (excluding user-submitted data) are the property of Chicmic Studios and are protected by intellectual property laws. You may not copy, modify, or distribute any part of the App without our written consent.",
  },
  {
    count: "6. ",
    title: "Prohibited Conduct",
    description: `You agree not to:\n(a) Use the App for any unlawful purpose.\n(b) Access or attempt to access other users’ data without authorization.\n(c) Introduce viruses or malicious code into the App.`,
  },
  {
    count: "7. ",
    title: "Termination",
    description:
      "We may suspend or terminate your access to the App at any time, with or without notice, if we believe you’ve violated these Terms.",
  },
  {
    count: "8. ",
    title: "Disclaimer of Warranties",
    description:
      'The App is provided "as is" without warranties of any kind. We do not guarantee that the App will be error-free or continuously available.',
  },
  {
    count: "9. ",
    title: "Limitation of Liability",
    description:
      "To the fullest extent permitted by law, Chicmic Studios shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.",
  },
  {
    count: "10. ",
    title: "Changes to Terms",
    description:
      "We may update these Terms from time to time. If we make material changes, we will notify you within the App or via email. Continued use of the App after changes means you accept the new Terms.",
  },
  {
    count: "11. ",
    title: "Governing Law",
    description:
      "These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.",
  },
  {
    count: "12. ",
    title: "Contact Us",
    description:
      "If you have any questions about these Terms, please contact us at:\nEmail:support_montra@yopmail.com.\nAddress: Chicmic Studios ,F-273, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071",
  },
];

export const Privacy_Policy = [
  {
    title: "1. Introduction",
    description:
      "This Privacy Policy describes how Chicmic Studios collects, uses, and protects your personal information when you use our expense tracking app.",
  },
  {
    title: "2. Information We Collect",
    description:
      "We may collect the following types of information:\n(a) Personal Information (e.g., name, email address etc)\n(b) Financial Data (e.g., expense and income records you input)\n (c) Device Information (e.g., IP address, device type, operating system)\n(d) Usage Data (e.g., app features you use, time spent on the app).",
  },
  {
    title: "3. How We Use Your Information",
    description:
      "We use your information to:\n(a) Provide and improve the App's functionality\n(b) Personalize your experience\n(c) Send important updates or notifications\n(d) Respond to your inquiries or support requests\n(e) Comply with legal obligations.",
  },
  {
    title: "4. Data Storage and Security",
    description:
      "We use secure servers and encryption to store your information. While we strive to protect your data, no method of transmission or storage is 100% secure. You use the App at your own risk.",
  },
  {
    title: "5. Sharing Your Information",
    description:
      "We do not sell your personal information. We may share it with:\n(a) Service providers who help us operate the app\n(b) Legal authorities if required by law\n(c) Third parties with your consent.",
  },
  {
    title: "6. Data Retention",
    description:
      "We retain your information as long as your account is active or as needed to provide our services. You may request deletion of your account and associated data at any time.",
  },
  {
    title: "7. Your Rights",
    description:
      "Depending on your location, you may have rights to access, correct, or delete your personal data. To exercise these rights, please contact us.",
  },
  {
    title: "8. Children's Privacy",
    description:
      "Our App is not intended for children under 13 (or the applicable minimum age). We do not knowingly collect personal data from children without parental consent.",
  },
  {
    title: "9. Changes to This Policy",
    description:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via the app or email.",
  },
  {
    title: "10. Contact Us",
    description:
      "If you have any questions about this Privacy Policy, please contact us at:\nEmail:support_montra@yopmail.com.\nAddress: Chicmic Studios ,F-273, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071.",
  },
];

export const checkApplicationPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log("✅ Notification permission granted");
  } else {
    console.log("❌ Notification permission denied");
  }

  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("✅ POST_NOTIFICATIONS permission granted (Android)");
      } else {
        console.log("❌ POST_NOTIFICATIONS permission denied (Android)");
      }
    } catch (error) {
      console.log("Permission error: ", error);
    }
  }
};

export async function checkCameraPermission() {
  const permission = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const status = await check(permission);
  console.log("Initial status:", status);

  if (status === "blocked") {
    Alert.alert(
      "Camera Permission Revoked",
      "You have revoked camera permission. Please allow camera access in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => openSettings().catch(() => console.warn("Cannot open settings")) },
      ]
    );
    return false;
  }

  if (status === "denied") {
    const result = await request(permission);
    console.log("Request result:", result);

    if (result === "blocked") {
      Alert.alert(
        "Camera Permission Revoked",
        "You have revoked camera permission. Please allow camera access in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => openSettings().catch(() => console.warn("Cannot open settings")) },
        ]
      );
      return false;
    }

    return result === RESULTS.GRANTED;
  }

  return status === RESULTS.GRANTED;
}
