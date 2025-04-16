// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { StyleSheet, Text, View, SafeAreaView, Button, PermissionsAndroid, Platform } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import Screens from "./Navigation/StackNavigation";
// import { Provider } from "react-redux";
// import Store from "./Store/Store";
// import Home from "./Screens/DrawerScreens/Home/Home";
// import "../ExpenseTracker/i18n/i18next";
// import notifee, { AuthorizationStatus } from "@notifee/react-native";
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
//     <Provider store={Store}>
//       <NavigationContainer>
//         <Screens />
//       </NavigationContainer>
//     </Provider>
//   );
// }

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
import { useState } from "react";
import { View, StyleSheet, Button, Platform, Text } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

export default function App() {
  const [selectedPrinter, setSelectedPrinter] = useState();

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={styles.container}>
      <Button title="Print" onPress={print} />
      <View style={styles.spacer} />
      <Button title="Print to PDF file" onPress={printToFile} />
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
