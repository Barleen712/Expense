import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Screens from "./Navigation/StackNavigation";
import SelectImageWithDocumentPicker from "./Screens/DrawerScreens/Home/Attachment";
import Income from "./Screens/DrawerScreens/Home/Income";
export default function App() {
  return (
    <NavigationContainer>
      <Income />
    </NavigationContainer>
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
