import { useEffect, useState } from "react";
import { View, Platform, TextInput, Text, TextStyle } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens, { TabScreens } from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import { store, persistor } from "./Store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./Context/ThemeContext";
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface ExtendedText extends Text {
  defaultProps: {
    allowFontScaling: boolean;
    style?: TextStyle;
  };
}

interface ExtendedTextInput extends TextInput {
  defaultProps: {
    allowFontScaling: boolean;
    style?: TextStyle;
  };
}

export default function App() {
  (Text as unknown as ExtendedText).defaultProps = {
    allowFontScaling: false,
    style: {
      fontFamily: "Inter-Regular", // or any font you use
      fontWeight: 400,
    },
  };
  (TextInput as unknown as ExtendedTextInput).defaultProps = {
    allowFontScaling: false,
    style: {
      fontFamily: "Inter", // or any font you use
      fontWeight: 400,
    },
  };
  const [user, setUser] = useState<CachedUser | null>(null);
  const [initialRoute, setInitialRoute] = useState<keyof StackParamList | undefined>(undefined);
  const [checkingAuth, setCheckingAuth] = useState(true); // 🆕
  GoogleSignin.configure({
    webClientId: "26672937768-d1b1daba6ovl6md8bkrfaaffpiugeihh.apps.googleusercontent.com",
    iosClientId: "26672937768-9fqv55u26fqipe8gn6kh9dh1tg71189b.apps.googleusercontent.com",
  });
  useEffect(() => {
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
            const isSocialUser = currentUser.providerData.some((provider) =>
              ["facebook.com", "google.com"].includes(provider.providerId)
            );
            if (currentUser.emailVerified || isSocialUser) {
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
            SplashScreen.hide();
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
