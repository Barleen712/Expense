import { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, PermissionsAndroid, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import Home from "./Screens/DrawerScreens/Home/Home";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Screens/FirebaseConfig";
import { TabScreens } from "./Navigation/StackNavigation";
import { ActivityIndicator } from "react-native-paper";
import BiometricAuth from "./Screens/DrawerScreens/Profile/Biometrics";
import styles from "./Screens/Stylesheet";
import MyComponent from "./Component";
import { FinancialReportIncome } from "./Screens/DrawerScreens/Transaction/FinancialReport/Report";
import Setpin from "./Screens/Onboarding/SetupPin01";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import DropdownComponent from "./Components/DropDown";
const checkApplicationPermission = async () => {
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
export default function App() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkApplicationPermission();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  {
    if (loading)
      return (
        <View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
        </View>
      );
  }
  return (
    <Provider store={Store}>
      <NavigationContainer>
        {/* <DropdownComponent /> */}
        {user ? <TabScreens /> : <Screens />}
        {/* <BiometricAuth/> */}
        {/* <Setpin /> */}
      </NavigationContainer>
    </Provider>
  );
}

// // // import { useTranslation } from "react-i18next";
// // // import { StringConstants } from "./Screens/Constants";
// // // const BookScreen = () => {
// // //   const { t } = useTranslation();

// // //   const changeLanguage = (language) => {
// // //     i18n.changeLanguage(language);
// // //   };
// // //   return (
// // //     <View>
// // //       <Text>{t(StringConstants.changeLanguage)}</Text>
// // //       <Button title="Change to Spanish" onPress={() => changeLanguage("es")} />
// // //       <Button title="Change to Italian" onPress={() => changeLanguage("it")} />
// // //       <Button title="Change to English" onPress={() => changeLanguage("en")} />
// // //     </View>
// // //   );
// // // // };
// import React, { useEffect } from "react";
// import { Button, View } from "react-native";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { auth } from "./Screens/FirebaseConfig";
// import { GoogleAuthProvider } from "firebase/auth";
// import { signInWithCredential } from "firebase/auth";
// import { clampRGBA } from "react-native-reanimated/lib/typescript/Colors";
// const App = () => {
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: "26672937768-d1b1daba6ovl6md8bkrfaaffpiugeihh.apps.googleusercontent.com",
//     });
//   }, []);
//   const handleGoogleSignIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       const tokens = await GoogleSignin.getTokens();
//       const googleCredential = GoogleAuthProvider.credential(tokens.idToken);
//       const creds = await signInWithCredential(auth, googleCredential);
//     } catch (error: any) {
//       console.error("Google Sign-In Error:", error);
//       Alert.alert("Error", error.message || "Google Sign-In failed");
//     }
//   };

//   return (
//     <View style={{ backgroundColor: "red" }}>
//       <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
//     </View>
//   );
// };

// export default App;
// import React, { useState, useCallback } from "react";
// import { View, SafeAreaView, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
// import MonthPicker from "react-native-month-year-picker";

// const App = () => {
//   const [date, setDate] = useState(new Date());
//   const [show, setShow] = useState(false);

//   const showPicker = useCallback((value) => setShow(value), []);

//   const onValueChange = useCallback(
//     (event, newDate) => {
//       if (Platform.OS === "android") {
//         showPicker(false); // Dismiss the picker immediately on Android
//       }

//       if (event === "dateSetAction" && newDate) {
//         setDate(newDate);
//         console.log("Selected Date:", newDate);
//       } else if (event === "dismissedAction") {
//         console.log("Picker dismissed");
//       }
//     },
//     []
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Month-Year Picker Example</Text>

//       <TouchableOpacity onPress={() => showPicker(true)} style={styles.button}>
//         <Text style={styles.buttonText}>Open Picker</Text>
//       </TouchableOpacity>

//       <Text style={styles.selectedDate}>
//         Selected: {date.getMonth() + 1}/{date.getFullYear()}
//       </Text>

//       {show && (
//         <MonthPicker
//           onChange={onValueChange}
//           value={date}
//           minimumDate={new Date(2022, 5)}
//           maximumDate={new Date(2040, 5)}
//           locale="en"
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "pink",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   buttonText: {
//     color: "black",
//     fontSize: 16,
//   },
//   selectedDate: {
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default App;
