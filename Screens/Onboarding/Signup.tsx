import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import GradientButton from "../../Components/CustomButton";
import Input from "../../Components/CustomTextInput";
import { Checkbox } from "react-native-paper";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
import { useTranslation } from "react-i18next";
import { StringConstants, handleGoogleSignIn } from "../Constants";
import { signOut } from "firebase/auth";
import Success from "./SignUp_success";
import { addUser, addGoogleUser } from "../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import styles from "../Stylesheet";
import { error } from "console";
type SignupProp = StackNavigationProp<StackParamList, "SignUp">;
interface Props {
  navigation: SignupProp;
}
export default function SignUp({ navigation }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "26672937768-d1b1daba6ovl6md8bkrfaaffpiugeihh.apps.googleusercontent.com",
      iosClientId: "26672937768-9fqv55u26fqipe8gn6kh9dh1tg71189b.apps.googleusercontent.com",
    });
  }, []);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [name, setname] = useState({ name: "", nameError: "" });
  const [email, setemail] = useState({ email: "", emailError: "" });
  const [password, setpass] = useState({ password: "", passwordError: "" });
  const [checked, setChecked] = useState({ state: false, error: "" });
  function handleChange() {
    setname({ ...name, nameError: "" });
    setemail({ ...email, emailError: "" });
    setpass({ ...password, passwordError: "" });
  }
  async function handleSignUp() {
    if (name.name === "") {
      setname({ ...name, nameError: "Name is required" });
      return;
    }
    if (email.email === "") {
      setemail({ ...email, emailError: "Email is required" });
      return;
    }
    const emailRegex =
      /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.email)) {
      setemail({ ...email, emailError: "Enter Valid Email" });
      return;
    }
    if (password.password === "") {
      setpass({ ...password, passwordError: "Password is required" });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+^#])[A-Za-z\d@$!%*?&()_+^#]{8,}$/;
    if (!passwordRegex.test(password.password)) {
      setpass({
        ...password,
        passwordError:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      });
      return;
    }
    if (checked.state === false) {
      setChecked({ ...checked, error: "Kindly agree to the Terms and Policy" });
      return;
    }
    dispatch(
      addUser({
        name: name.name,
        email: email.email,
        password: password.password,
        google: false,
      })
    );
    setname({ name: "", nameError: "" });
    setemail({ email: "", emailError: "" });
    setpass({ password: "", passwordError: "" });
    setChecked({ state: false, error: "" });
    navigation.navigate("Setpin");
  }
  const { t } = useTranslation();

  async function GoogleSignIn() {
    const { id, name, photo } = await handleGoogleSignIn();
    dispatch(
      addGoogleUser({
        id: id,
        google: true,
        username: name,
        photo: photo,
      })
    );
    navigation.navigate("Setpin");
  }

  return (
    <SafeAreaView style={[styles.container, { alignItems: "center" }]}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <Header title={t(StringConstants.SignUp)} press={() => navigation.goBack()}></Header>
      <View style={style.input}>
        <Input
          ref={nameRef}
          title={t(StringConstants.Name)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          name={name.name}
          // handleFocus={handleChange}
          onchange={(data) => {
            const onlyAlphabets = data.replace(/[^a-zA-Z\s]/g, "");
            setname({ nameError: "", name: onlyAlphabets });
          }}
          isPass={false}
        />

        {name.nameError !== "" && (
          <Text
            style={{
              color: "rgb(255, 0, 17)",
              marginTop: 4,
              marginLeft: 10,
              fontFamily: "Inter",
              width: "90%",
            }}
          >
            {name.nameError}*
          </Text>
        )}
        <Input
          ref={emailRef}
          title={t(StringConstants.Email)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          name={email.email}
          handleFocus={() => {
            if (!name.name.trim()) {
              setname({ ...name, nameError: "Name is required" });
              nameRef.current?.focus();
            }
          }}
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
            {password.passwordError}*
          </Text>
        )}
      </View>
      <View style={{ flexDirection: "row", margin: 20, width: "90%", justifyContent: "space-evenly" }}>
        <View style={{ borderWidth: Platform.OS === "ios" ? 1 : 0, flex: 0.1 }}>
          <Checkbox
            status={checked.state ? "checked" : "unchecked"}
            onPress={() => setChecked({ state: !checked.state, error: checked.state ? checked.error : "" })}
            color="rgb(57, 112, 109)"
          />
        </View>
        <Text style={{ flex: 0.9 }}>
          {t(StringConstants.Bysigningupyouagreetothe)}{" "}
          <Text style={{ color: "rgb(57, 112, 109)" }}>{t(StringConstants.TermsofServiceandPrivacyPolicy)}</Text>
        </Text>
      </View>
      {checked.error !== "" && (
        <Text
          style={{
            color: "rgb(255, 0, 17)",
            marginTop: 4,
            marginLeft: 10,
            fontFamily: "Inter",
            width: "90%",
          }}
        >
          {checked.error}*
        </Text>
      )}
      <GradientButton title="Sign Up" handles={handleSignUp} />
      <Text style={style.or}>{t(StringConstants.orwith)}</Text>
      <TouchableOpacity style={style.GoogleView} onPress={GoogleSignIn}>
        <Image style={style.Google} source={require("../../assets/Google.png")} />
        <Text style={style.textGoogle}>{t(StringConstants.SignUpwithGoogle)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={style.account}>
          {t(StringConstants.Alreadyhaveanaccount)} <Text style={style.span}>{t(StringConstants.Login)}</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  textinput: {
    width: 343,
    height: 56,
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 20 : 30,
    width: "100%",
  },
  or: {
    color: "rgb(145, 145, 159)",
    margin: 10,
  },
  GoogleView: {
    flexDirection: "row",
    height: 56,
    width: 343,
    alignItems: "center",
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 60,
  },
  Google: {
    height: 40,
    width: 40,
  },
  account: {
    margin: 15,
  },
  span: {
    color: "rgb(57, 112, 109)",
    textDecorationLine: "underline",
  },
  textGoogle: {
    paddingLeft: 10,
  },
});
