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
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useSelector } from "react-redux";
import { AddPin } from "../FirestoreHandler";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithCredential } from "firebase/auth";
type PinProp = StackNavigationProp<StackParamList, "Setpin1">;

interface Props {
  navigation: PinProp;
}
export default function Setpin02({ navigation, route }: Props) {
  const { email, password } = useSelector((state) => state.Money.signup);
  const { id, google } = useSelector((state) => state.Money.googleSign);
  const [pin, setpin] = useState("");

  const handleClear = () => {
    setpin("");
  };
  async function handlenext() {
    if (route.params.FirstPin === pin && google === true) {
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        AddPin({
          Pin: pin,
          userId: user.user?.uid,
        });
        navigation.navigate("AllSet", { title: "All Set" });
      } catch (error: any) {
        alert(error.message);
      }
    } else if (route.params.FirstPin === pin) {
      const googleCredential = GoogleAuthProvider.credential(id);
      const creds = await signInWithCredential(auth, googleCredential);
      const user = auth.currentUser;
      AddPin({
        Pin: pin,
        userId: user.uid,
      });
      navigation.navigate("AllSet", { title: "All Set" });
    } else {
      alert("PINS don't match. \nPlease Re-Enter your Pin");
      handleClear();
    }
  }
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.setup}>
        <Text style={styles.setuptext}>{t(StringConstants.OkRetypeyourPinagain)}</Text>
      </View>
      <Pin pin={pin} />
      <View style={styles.keypad}>
        <Keypad
          change={handlenext}
          onClear={handleClear}
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
