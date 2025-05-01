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
  const [email, setemail] = useState({ email: "", emailError: "" });
  const [password, setpass] = useState({ password: "", passwordError: "" });
  const [loading, setLoading] = useState(false);
  function handleChange() {
    setemail({ ...email, emailError: "" });
    setpass({ ...password, passwordError: "" });
  }
  async function handlesLogin() {
    if (email.email === "") {
      setemail({ ...email, emailError: "Enter Email" });
      return;
    }
    const emailRegex =
      /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.email)) {
      setemail({ ...email, emailError: "Enter Valid Email" });
      return;
    }
    if (password.password === "") {
      setpass({ ...password, passwordError: "Enter Password" });
      return;
    }
    if (password.password.length < 6) {
      setpass({ ...password, passwordError: "Enter Password of length atleast 6" });
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.email, password.password);
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
          name={email.email}
          onchange={(data) => {
            setemail({ emailError: "", email: data });
          }}
          isPass={false}
          handleFocus={handleChange}
        />
        {email.emailError !== "" && (
          <Text
            style={{
              color: "rgb(255, 0, 17)",
              marginTop: 4,
              marginLeft: 10,
              fontFamily: "Inter",
              width: "90%",
            }}
          >
            *{email.emailError}
          </Text>
        )}
        <Input
          title={t(StringConstants.Password)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          isPass={true}
          name={password.password}
          handleFocus={handleChange}
          onchange={(data) => {
            setpass({ password: data, passwordError: "" });
          }}
        />
        {password.passwordError !== "" && (
          <Text
            style={{
              color: "rgb(255, 0, 17)",
              marginTop: 4,
              marginLeft: 10,
              fontFamily: "Inter",
              width: "90%",
            }}
          >
            *{password.passwordError}
          </Text>
        )}
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
    width: "100%",
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
