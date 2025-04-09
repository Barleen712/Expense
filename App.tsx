import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import Home from "./Screens/DrawerScreens/Home/Home";

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
