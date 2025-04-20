import { StatusBar } from "expo-status-bar";
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
        {user ? <TabScreens/> : <Screens />}
        {/* <BiometricAuth/> */}
        
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
// import React, { useEffect } from 'react';
// import { Button, View } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { clampRGBA } from 'react-native-reanimated/lib/typescript/Colors';

// const App = () => {
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: '53534647041-pinc0e5hilnf8cs5q2dfuk2amcvui26f.apps.googleusercontent.com', // from Firebase console
//     });
//    console.log("done")
//   }, []);

//   const signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       console.log("done1")
//       const userInfo = await GoogleSignin.signIn();
//       console.log("done2")
//       console.log('User Info:', userInfo);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <View style={{backgroundColor:"red"}}>
//       <Button title="Sign in with Google" onPress={signIn} />
//     </View>
//   );
// };

// export default App;
