import { useEffect, useState } from "react";
import { View, PermissionsAndroid, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens, { TabScreens } from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import { store, persistor } from "./Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./Context/ThemeContext";
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Screens/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
import { getUseNamerDocument } from "./Saga/BudgetSaga";
import StackParamList from "./Navigation/StackList";
import { useNetInfo } from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import { CachedUser, saveUserData, getCachedUser, clearUserData } from "./utils/userStorage";
import { syncUnsyncedTransactions, syncPendingDeletes, syncPendingUpdatesToFirestore } from "./Realm/Sync";
import { syncPendingDeletesBudget, syncPendingUpdatesToFirestoreBudgets, syncUnsyncedBudget } from "./Realm/SyncBudget";
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
  const [user, setUser] = useState<CachedUser | null>(null);
  const [initialRoute, setInitialRoute] = useState<keyof StackParamList | undefined>(undefined);
  const [checkingAuth, setCheckingAuth] = useState(true); // 🆕

  // useEffect(() => {
  //   if (Platform.OS === "android") SplashScreen.hide();
  // }, []);

  useEffect(() => {
    checkApplicationPermission();

    const initAuth = async () => {
      const cached = await getCachedUser();

      if (cached) {
        setInitialRoute(cached.pinSet ? "EnterPin" : "Setpin");
        setUser(cached);
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            await currentUser.reload();

            if (currentUser.emailVerified) {
              const userdetails = await getUseNamerDocument();

              const updatedUser: CachedUser = {
                uid: currentUser.uid,
                pinSet: userdetails?.pinSet ?? false,
              };

              await saveUserData(updatedUser);

              setInitialRoute(updatedUser.pinSet ? "EnterPin" : "Setpin");
              setUser(updatedUser);
            } else {
              await auth.signOut();
              await clearUserData();
              setUser(null);
            }
          } catch (err) {
            console.error("Auth error:", err);
          }
        } else {
          setUser(null);
        }

        setCheckingAuth(false);
      });
      return unsubscribe;
    };

    initAuth();
  }, []);
  const { isConnected } = useNetInfo();
  useEffect(() => {
    syncUnsyncedTransactions();
    syncPendingDeletes({ isConnected });
    syncPendingUpdatesToFirestore();
    syncUnsyncedBudget();
    syncPendingDeletesBudget({ isConnected });
    syncPendingUpdatesToFirestoreBudgets();
  }, [isConnected]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <NavigationContainer
          onReady={() => {
            if (Platform.OS === "android") SplashScreen.hide();
          }}
        >
          <ThemeProvider>
            {user ? <TabScreens initial={initialRoute} /> : <Screens />}

            <Toast />
          </ThemeProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
