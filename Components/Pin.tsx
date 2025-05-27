import React, { useState } from "react";
import { View } from "react-native";
import styles from "../Screens/Stylesheet";
export default function Pin({ pin }: { pin: string }) {
  return (
    <View style={styles.pin}>
      {Array(4)
        .fill("")
        .map((_, index) => (
          <View key={index} style={[styles.dot, pin.length > index && styles.filledDot]}></View>
        ))}
    </View>
  );
}
