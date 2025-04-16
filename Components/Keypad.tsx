import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import styles from "../Screens/Stylesheet";
interface keypad {
  change: () => void;
}
export default function Keypad({ change }: keypad) {
  const keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <View>
      <FlatList
        data={keypad}
        columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
        scrollEnabled={false}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={index} style={styles.keypad1}>
            <Text style={styles.number}>{item}</Text>
          </TouchableOpacity>
        )}
      ></FlatList>
      <TouchableOpacity onPress={change}>
        <Image style={styles.arrow} source={require("../assets/right-arrow.png")} />
      </TouchableOpacity>
    </View>
  );
}
