import React, { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import Keypad from "../../../Components/Keypad";
import Pin from "../../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { getUseNamerDocument, getUserDocument } from "../../../Saga/BudgetSaga";
type pinProp = StackNavigationProp<StackParamList, "Setpin">;

interface Props {
  navigation: pinProp;
}
export default function EnterPin({ navigation }: Props) {
  const handleClear = () => {
    setpin(pin.slice(0, pin.length - 1));
  };
  const [pin, setpin] = useState("");
  async function handlenext() {
    const Pin = await getUseNamerDocument();
    if (Pin.pin === pin) {
      navigation.replace("MainScreen");
    } else {
      if (pin.length !== 4) {
        alert("enter pin");
      } else {
        alert("Wrong Pin!");
        handleClear();
      }
    }
  }
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={[styles.setup, { justifyContent: "center" }]}>
        <Text style={styles.setuptext}>Enter your Pin</Text>
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
