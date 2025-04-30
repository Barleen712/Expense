import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import styles from "../Screens/Stylesheet";
interface keypad {
  change: () => void;
  onKeyPress: (num: number) => void;
  onClear?: () => void;
}
export default function Keypad({ change, onKeyPress, onClear }: keypad) {
  const keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "A"];
  const handlePress = (item: number | string) => {
    if (typeof item === "number") {
      onKeyPress(item);
    } else if (item === "C" && onClear) {
      onClear();
    } else if (item === "A") {
      change();
    }
  };
  return (
    <View>
      <FlatList
        data={keypad}
        //columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
        scrollEnabled={false}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handlePress(item)} key={index} style={styles.keypad1}>
            <Text style={styles.number}> {item === "C" ? "⌫" : item === "A" ? "➔" : item}</Text>
          </TouchableOpacity>
        )}
      ></FlatList>
      {/* <TouchableOpacity onPress={change} style={styles.arrow}>
        <Image style={{ width: 50, height: 40 }} source={require("../assets/right-arrow.png")} />
      </TouchableOpacity> */}
    </View>
  );
}
