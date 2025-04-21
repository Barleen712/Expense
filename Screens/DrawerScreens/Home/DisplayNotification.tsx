import React from "react";
import { View, FlatList, Text } from "react-native";
import Header from "../../../Components/Header";
import styles from "../../Stylesheet";
export default function DisplayNotification({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Notification" press={() => navigation.goBack()} />
    </View>
  );
}
