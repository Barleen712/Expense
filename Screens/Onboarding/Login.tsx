import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "../../Components/CustomTextInput";
import GradientButton from "../../Components/CustomButton";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
import { useTranslation } from "react-i18next";
import { StringConstants } from "../Constants";
type LoginProp = StackNavigationProp<StackParamList, "Login">;

interface Props {
  navigation: LoginProp;
}
export default function Login({ navigation }: Props) {
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  async function handlesLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Setpin");
    } catch (error: any) {
      alert(error.message);
    }
  }
  const { t } = useTranslation();
  return (
    <View style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}>
      <Header title={t(StringConstants.Login)} press={() => navigation.goBack()} />
      <View style={styles.input}>
        <Input
          title={t(StringConstants.Email)}
          color="rgb(56, 88, 85)"
          css={styles.textinput}
          name={email}
          onchange={setemail}
          isPass={false}
        />
        <Input
          title={t(StringConstants.Password)}
          color="rgb(56, 88, 85)"
          css={styles.textinput}
          isPass={true}
          name={password}
          onchange={setpass}
        />
      </View>
      <GradientButton title={t(StringConstants.Login)} handles={handlesLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>{t(StringConstants.ForgotPassword)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
        <Text style={styles.account}>
          {t(StringConstants.Donthaveanaccountyet)} <Text style={styles.span}>{t(StringConstants.SignUp)}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  textinput: {
    width: 343,
    height: 56,
    color: "black",
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 20,
    padding: 15,
  },
  input: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 30 : 40,
  },

  forgot: {
    margin: 20,
    color: " rgb(56, 88, 85)",
  },
  account: {
    padding: 20,
    color: "black",
  },
  span: {
    color: "rgb(57, 112, 109)",
    textDecorationLine: "underline",
  },
});
