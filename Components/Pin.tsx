import React from "react";
import { View } from "react-native";
import styles from "../Screens/Stylesheet";

export default function Pin({ pin }: Readonly<{ pin: string }>) {
  const dotKeys = ["dot-1", "dot-2", "dot-3", "dot-4"];

  return (
    <View style={styles.pin}>
      {dotKeys.map((key, index) => (
        <View key={key} style={[styles.dot, pin.length > index && styles.filledDot]} />
      ))}
    </View>
  );
}
