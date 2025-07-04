import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../Stylesheet";
import Keypad from "../../Components/Keypad";
import Pin from "../../Components/Pin";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import { StringConstants } from "../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateUserDoc } from "../FirestoreHandler";
import { Ionicons } from "@expo/vector-icons";
import { addUser } from "../../Slice/IncomeSlice";
import { getUseNamerDocument } from "../../Saga/BudgetSaga";
import { auth } from "../FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
type PinProp = StackNavigationProp<StackParamList, "Setpin1">;

interface Props {
  navigation: PinProp;
  route: {
    params: {
      FirstPin: string;
    };
  };
}
export default function Setpin02({ navigation, route }: Readonly<Props>) {
  const [pin, setpin] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const handleClear = () => {
    setpin(pin.slice(0, pin.length - 1));
  };
  async function handlenext() {
    setLoading(true);
    if (route.params.FirstPin === pin) {
      try {
        const user = await getUseNamerDocument();
        if (auth.currentUser) {
          await updateUserDoc(auth.currentUser.uid, { pinSet: true, pin: pin });
          if (user) {
            dispatch(
              addUser({
                User: user.Name,
                Photo: user?.Photo,
                index: user?.Index,
                pin: pin,
              })
            );
            navigation.reset({ index: 0, routes: [{ name: "MainScreen" }] });
          } else {
            alert("User data not found. Please try again.");
          }
        } else {
          alert("User not authenticated. Please log in again.");
        }
      } catch (error: any) {
        console.log(error);
      }
    } else {
      setLoading(false);
      alert("PINS don't match. \nPlease Re-Enter your Pin");
      handleClear();
    }

    setpin("");
    setLoading(false);
  }

  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ backgroundColor: "#2A7C76", flex: 1, alignItems: "center" }}>
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
    </SafeAreaView>
  );
}
