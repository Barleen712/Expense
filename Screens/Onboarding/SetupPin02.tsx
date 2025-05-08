import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../Stylesheet";
import Keypad from "../../Components/Keypad";
import Pin from "../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { raiseToast, StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { updateUserDoc } from "../FirestoreHandler";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "../../Store/Store";
import { getUseNamerDocument } from "../../Saga/BudgetSaga";
type PinProp = StackNavigationProp<StackParamList, "Setpin1">;

interface Props {
  navigation: PinProp;
  route: {
    params: {
      FirstPin: string;
    };
  };
}
export default function Setpin02({ navigation, route }: Props) {
  const { email, password, name } = useSelector((state: RootState) => state.Money.signup);
  const { id, google, username, photo } = useSelector((state: RootState) => state.Money.googleSign);
  const [pin, setpin] = useState("");
  const handleClear = () => {
    setpin(pin.slice(0, pin.length - 1));
  };
  async function handlenext() {
    if (route.params.FirstPin === pin) {
      try {
        const { ID } = await getUseNamerDocument();
        await updateUserDoc(ID, { pinSet: true, pin: pin });
        navigation.replace("MainScreen");
      } catch (error: any) {
        raiseToast("Sign Up Failed", error.code);
      }

      // } else if (route.params.FirstPin === pin && google === true) {
      //   const googleCredential = GoogleAuthProvider.credential(id);
      //   const creds = await signInWithCredential(auth, googleCredential);
      //   const user = creds.user;
      //   AddPin({
      //     Pin: pin,
      //     userId: user.uid,
      //   });
      //   AddUser({ User: username, photo: { uri: photo }, userId: user.uid, index: null });
      //   navigation.navigate("AllSet", { title: "You are set!" });
    } else {
      alert("PINS don't match. \nPlease Re-Enter your Pin");
      handleClear();
    }
    setpin("");
  }
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center" }}>
      <View style={styles.setup}>
        <TouchableOpacity
          style={{
            width: "10%",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={30} color={"white"} onPress={() => navigation.goBack()} />
        </TouchableOpacity>
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
