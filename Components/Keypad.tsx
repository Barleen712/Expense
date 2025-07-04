import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "../Screens/Stylesheet";
interface KeypadProps {
  change: () => void;
  onKeyPress: (num: number) => void;
  onClear?: () => void;
}
export default function Keypad({ change, onKeyPress, onClear }: Readonly<KeypadProps>) {
  const keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "A"];
  const handlePress = (item: number | string) => {
    if (typeof item === "number") {
      onKeyPress(item);
      console.log(item);
    } else if (item === "C" && onClear) {
      onClear();
    } else if (item === "A") {
      change();
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <FlatList
        data={keypad}
        scrollEnabled={false}
        style={{ flex: 1 }}
        numColumns={3}
        renderItem={({ item, index }) => {
          let displayText = item;
          if (item === "C") {
            displayText = "⌫";
          } else if (item === "A") {
            displayText = "➔";
          }

          return (
            <TouchableOpacity onPress={() => handlePress(item)} key={index} style={styles.keypad1}>
              <Text style={styles.number}>{displayText}</Text>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </View>
  );
}
