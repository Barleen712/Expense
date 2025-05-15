import { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import { ThemeProvider } from "./Context/ThemeContext";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Screens/FirebaseConfig";
import { TabScreens } from "./Navigation/StackNavigation";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
import { getUseNamerDocument, getUserDocument } from "./Saga/BudgetSaga";
import StackParamList from "./Navigation/StackList";
import NetInfo from "@react-native-community/netinfo";

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
  const [initialRoute, setinitialRoute] = useState<keyof StackParamList | undefined>(undefined);
  useEffect(() => {
    checkApplicationPermission();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          const userdetails = await getUseNamerDocument();
          if (userdetails?.pinSet === false) {
            setinitialRoute("Setpin");
          } else {
            setinitialRoute("EnterPin");
            //  deleteRealmDatabase();
          }
          setUser(currentUser);
        } else {
          auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      NetInfo.fetch().then((state) => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
      });
    });
    return () => unsubscribe();
  }, []);
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <ThemeProvider>
          {user ? <TabScreens initial={initialRoute} /> : <Screens />}
          {/* <Tutorial /> */}
          {/* <Setpin /> */}
          <Toast />
        </ThemeProvider>
      </NavigationContainer>
    </Provider>
  );
}
