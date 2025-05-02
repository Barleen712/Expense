import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../Stylesheet";
import Keypad from "../../Components/Keypad";
import Pin from "../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
type pinProp = StackNavigationProp<StackParamList, "Setpin">;

interface Props {
  navigation: pinProp;
}
export default function Setpin({ navigation }: Props) {
  const [pin, setpin] = useState("");
  function handlenext() {
    if (pin.length === 4) navigation.navigate("Setpin1", { FirstPin: pin });
    setpin("");
  }
  const { t } = useTranslation();
  const handleClear = () => {
    setpin("");
  };
  return (
    <View style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.setup}>
        <Text style={styles.setuptext}>{t(StringConstants.LetssetupyouPin)}</Text>
      </View>
      <Pin pin={pin} />
      <View style={styles.keypad}>
        <Keypad
          onClear={handleClear}
          change={handlenext}
          onKeyPress={(num) => {
            if (pin.length < 4) {
              setpin((prev) => prev + num);
            }
          }}
        />
      </View>
    </View>
  );
}
