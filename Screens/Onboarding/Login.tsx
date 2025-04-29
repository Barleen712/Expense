import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import Success from "./SignUp_success";
import styles from "../Stylesheet";
type LoginProp = StackNavigationProp<StackParamList, "Login">;

interface Props {
  navigation: LoginProp;
}
export default function Login({ navigation }: Props) {
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [loading, setLoading] = useState(false);
  async function handlesLogin() {
    if (email === "") {
      alert("Enter Email");
      return;
    }
    if (password === "") {
      alert("Enter Password");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("AllSet", { title: "Log In SUCCESS!" });
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
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
    <SafeAreaView style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}>
      <Header title={t(StringConstants.Login)} press={() => navigation.goBack()} />
      <View style={style.input}>
        <Input
          title={t(StringConstants.Email)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          name={email}
          onchange={setemail}
          isPass={false}
        />
        <Input
          title={t(StringConstants.Password)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          isPass={true}
          name={password}
          onchange={setpass}
        />
      </View>
      <GradientButton title={t(StringConstants.Login)} handles={handlesLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={style.forgot}>{t(StringConstants.ForgotPassword)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
        <Text style={style.account}>
          {t(StringConstants.Donthaveanaccountyet)} <Text style={style.span}> {t(StringConstants.SignUp)}</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
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
    marginTop: Platform.OS === "ios" ? 30 : 80,
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
