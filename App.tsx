import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import Home from "./Screens/DrawerScreens/Home/Home";
import "../ExpenseTracker/i18n/i18next";
import i18n from "../ExpenseTracker/i18n/i18next";
export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </Provider>
  );
}

// // import { useTranslation } from "react-i18next";
// // import { StringConstants } from "./Screens/Constants";
// // const BookScreen = () => {
// //   const { t } = useTranslation();

// //   const changeLanguage = (language) => {
// //     i18n.changeLanguage(language);
// //   };
// //   return (
// //     <View>
// //       <Text>{t(StringConstants.changeLanguage)}</Text>
// //       <Button title="Change to Spanish" onPress={() => changeLanguage("es")} />
// //       <Button title="Change to Italian" onPress={() => changeLanguage("it")} />
// //       <Button title="Change to English" onPress={() => changeLanguage("en")} />
// //     </View>
// //   );
// // };

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View, Button } from "react-native";
// import { Platform, PermissionsAndroid } from "react-native";
// import notifee, { AuthorizationStatus } from "@notifee/react-native";
// import { useEffect } from "react";
// import { onDisplayNotification } from "./Screens/DrawerScreens/Budget/TestNotification";

// const checkApplicationPermission = async () => {
//   const settings = await notifee.requestPermission();

//   if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
//     console.log("✅ Notification permission granted");
//   } else {
//     console.log("❌ Notification permission denied");
//   }

//   if (Platform.OS === "android") {
//     try {
//       const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("✅ POST_NOTIFICATIONS permission granted (Android)");
//       } else {
//         console.log("❌ POST_NOTIFICATIONS permission denied (Android)");
//       }
//     } catch (error) {
//       console.log("Permission error: ", error);
//     }
//   }
// };
// export default function App() {
//   useEffect(() => {
//     checkApplicationPermission();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Click Me"
//         onPress={() => onDisplayNotification({ title: "Test Notification", body: "This is a test notification." })}
//       />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
