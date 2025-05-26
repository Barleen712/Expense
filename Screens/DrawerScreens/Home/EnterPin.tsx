import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../Stylesheet";
import Keypad from "../../../Components/Keypad";
import Pin from "../../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { handleBiometricAuth } from "../../Constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
type pinProp = StackNavigationProp<StackParamList, "Setpin">;

interface Props {
  navigation: pinProp;
}
export default function EnterPin({ navigation }: Props) {
  const handleClear = () => {
    setpin(pin.slice(0, pin.length - 1));
  };
  const [pin, setpin] = useState("");
  const [opendots, setopendots] = useState(false);
  const [reset, setreset] = useState(false);
  const user = useSelector((state) => state.Money.signup);

  async function handlenext() {
    if (user.pin === pin && reset === false) {
      navigation.replace("MainScreen");
    } else if (user.pin === pin && reset === true) {
      navigation.navigate("Setpin");
    } else {
      if (pin.length !== 4) {
        alert("Enter pin");
      } else {
        setpin("");
        alert("Wrong Pin!");
      }
    }
  }
  const { t } = useTranslation();
  useEffect(() => {
    handleBiometricAuth(navigation);
  }, []);
  return (
    <View style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={[styles.setup, { justifyContent: "center" }]}>
        {reset && (
          <TouchableOpacity
            style={[styles.iconContainer, { position: "absolute", left: "2%" }]}
            onPress={() => setreset(false)}
          >
            <Ionicons name="arrow-back" size={30} color={"white"} />
          </TouchableOpacity>
        )}
        <Text style={styles.setuptext}>{reset ? "Confirm your Pin" : "Enter your Pin"}</Text>
        {!user.Google && (
          <TouchableOpacity
            style={{ position: "absolute", top: "35%", right: "3%", height: "100%" }}
            onPress={() => setopendots(!opendots)}
          >
            <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
          </TouchableOpacity>
        )}
        {opendots && (
          <View
            style={{
              backgroundColor: "white",
              width: "30%",
              position: "absolute",
              right: "6%",
              top: "75%",
              height: "80%",
              elevation: 100,
              shadowColor: "red",
              shadowOpacity: 1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              borderColor: "gray",
              borderWidth: 1,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: "50%",
                marginLeft: 5,
              }}
              onPress={() => {
                setpin("");
                navigation.navigate("ForgotPin");
              }}
            >
              <MaterialCommunityIcons name="lock-question" size={24} color="black" />
              <Text style={{ fontWeight: "bold" }}>Forgot Pin?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: "50%",
                marginLeft: 5,
              }}
              onPress={() => {
                setpin("");
                setreset(true);
                setopendots(false);
              }}
            >
              <MaterialIcons name="lock-reset" size={24} color="black" />
              <Text style={{ fontWeight: "bold" }}> Reset Pin?</Text>
            </TouchableOpacity>
          </View>
        )}
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
