import React, { useState, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../../Components/CustomTextInput";
import GradientButton from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
import { raiseToast, StringConstants } from "../../Constants";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { getStyles } from "./styles";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import { useDispatch } from "react-redux";
import { addUser } from "../../../Slice/IncomeSlice";
import { ScrollView } from "react-native-gesture-handler";
type LoginProp = StackNavigationProp<StackParamList, "Login">;

interface Props {
  navigation: LoginProp;
}
export default function Login({ navigation }: Readonly<Props>) {
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const [email, setemail] = useState({ email: "", emailError: "" });
  const [password, setpassword] = useState({ password: "", error: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  function handleChange() {
    setemail({ ...email, emailError: "" });
    setpassword({ ...password, error: "" });
  }
  async function handlesLogin() {
    if (email.email === "") {
      setemail({ ...email, emailError: "Email is required" });
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.email)) {
      setemail({ ...email, emailError: "Enter Valid Email" });
      return;
    }
    if (password.password === "") {
      setpassword({ ...password, error: "Password is required" });
      return;
    }
    if (password.password.length < 6) {
      setpassword({ ...password, error: "Enter Password of length atleast 6" });
      return;
    }
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email.email, password.password);
      setLoading(false);
      if (!user.user.emailVerified) {
        raiseToast("error", "Login Failed", "fail");
        await auth.signOut();
        setLoading(false);
        setemail({ email: "", emailError: "" });
        setpassword({ password: "", error: "" });
        return;
      }
      const userDoc = await getUseNamerDocument();
      if (userDoc) {
        dispatch(
          addUser({
            User: userDoc.Name,
            Photo: userDoc.Photo,
            index: userDoc.Index,
            pin: userDoc.pin,
          })
        );
        raiseToast("success", "Welcome Back", "login");
      } else {
        raiseToast("error", "User document not found", "fail");
      }
    } catch (error: any) {
      console.log(error);
      raiseToast("error", "Login Failed", error.code);

      setLoading(false);
    }
    setemail({ email: "", emailError: "" });
    setpassword({ password: "", error: "" });
  }
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const style = getStyles(colors);
  if (loading) {
    return (
      <View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  }
  return (
    <SafeAreaView style={style.container}>
      <Header
        title={t(StringConstants.Login)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <ScrollView contentContainerStyle={{ alignItems: "center" }} style={{ width: "100%" }}>
        <View style={style.input}>
          <Input
            ref={emailRef}
            title={t(StringConstants.Email)}
            color="rgb(56, 88, 85)"
            css={style.textinput}
            name={email.email}
            onchange={(data) => {
              setemail({ emailError: "", email: data });
            }}
            isPass={false}
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
              {email.emailError}*
            </Text>
          )}
          <Input
            ref={passwordRef}
            title={t(StringConstants.Password)}
            color="rgb(56, 88, 85)"
            css={style.textinput}
            isPass={true}
            name={password.password}
            handleFocus={() => {
              if (!email.email.trim()) {
                setemail({ ...email, emailError: "Email is required" });
                emailRef.current?.focus();
              }
            }}
            onchange={(data) => {
              setpassword({ password: data, error: "" });
            }}
          />
          {password.error !== "" && (
            <Text
              style={{
                color: "rgb(255, 0, 17)",
                marginTop: 4,
                marginLeft: 10,
                fontFamily: "Inter",
                width: "90%",
              }}
            >
              {password.error}*
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
      </ScrollView>
    </SafeAreaView>
  );
}
