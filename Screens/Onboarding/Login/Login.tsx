import React, { useState, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../../Components/CustomTextInput";
import GradientButton from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
import { handleGoogleSignIn, raiseToast, StringConstants } from "../../Constants";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { getStyles } from "./styles";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import { useDispatch } from "react-redux";
import { addGoogleUser, addUser } from "../../../Slice/IncomeSlice";
import { ScrollView } from "react-native-gesture-handler";
import { AddUser } from "../../FirestoreHandler";
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
    if (email.email === "" && password.password === "") {
      setemail({ ...email, emailError: "Email is required" });
      setpassword({ ...password, error: "Password is required" });
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
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email.email, password.password);
      setLoading(false);
      if (!user.user.emailVerified) {
        raiseToast("error", "Login Failed", "fail");
        await auth.signOut();
        setLoading(false);
        // setemail({ email: "", emailError: "" });
        // setpassword({ password: "", error: "" });
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
        raiseToast("success", "Welcome", "login");
      } else {
        raiseToast("error", "User document not found", "fail");
      }
    } catch (error: any) {
      console.log(error);
      raiseToast("error", "Login Failed", error.code);

      setLoading(false);
    }
    // setemail({ email: "", emailError: "" });
    // setpassword({ password: "", error: "" });
  }
  const googleLogin = async () => {
    const googleResult = await handleGoogleSignIn();
    if (!googleResult) {
      raiseToast("error", "Google Sign In Failed", "no-data");
      return;
    }
    const { id, name, photo }: { id: string; name: string | null | undefined; photo: string | null | undefined } =
      googleResult;
    dispatch(
      addGoogleUser({
        id: id,
        google: true,
        username: name,
        Photo: photo,
      })
    );
    setLoading(true);
    const googleCredential = GoogleAuthProvider.credential(id);
    const creds = await signInWithCredential(auth, googleCredential);
    const user = creds.user;
    const userDoc = await getUseNamerDocument();
    if (userDoc) {
      raiseToast("success", "Welcome Back", "login");
      dispatch(
        addUser({
          User: userDoc.Name,
          Photo: userDoc?.Photo,
          index: userDoc?.Index,
          pin: userDoc?.pin,
          Google: userDoc?.Google,
        })
      );
      setLoading(false);
      return;
    }

    raiseToast("success", "Sign Up Success", "done");
    AddUser({ User: name, Photo: { uri: photo }, userid: user.uid, index: null, pinSet: false, Google: true });
    setLoading(false);
  };
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
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ width: "100%" }}
        keyboardShouldPersistTaps={"handled"}
      >
        <View style={style.input}>
          <View style={{ width: "100%", height: "50%", justifyContent: "center" }}>
            <Input
              ref={emailRef}
              title={t(StringConstants.Email)}
              color="rgba(145, 145, 159, 1)"
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
                  position: "absolute",
                  bottom: "0%",
                  marginLeft: 20,
                  fontFamily: "Inter",
                  width: "90%",
                  fontSize: 12,
                }}
              >
                {email.emailError}
              </Text>
            )}
          </View>
          <View style={{ width: "100%", height: "50%", justifyContent: "center" }}>
            <Input
              ref={passwordRef}
              title={t(StringConstants.Password)}
              color="rgba(145, 145, 159, 1)"
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
                  position: "absolute",
                  bottom: "0%",
                  // marginBottom: 10,
                  marginLeft: 20,
                  fontFamily: "Inter",
                  width: "90%",
                  fontSize: 12,
                  // backgroundColor: "red",
                }}
              >
                {password.error}
              </Text>
            )}
          </View>
        </View>
        <GradientButton title={t(StringConstants.Login)} handles={handlesLogin} />
        <Text style={style.or}>Or</Text>
        <TouchableOpacity style={style.GoogleView} onPress={googleLogin}>
          <Image style={style.Google} source={require("../../../assets/Google.png")} />
          <Text style={style.textGoogle}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={style.forgot}>{t(StringConstants.ForgotPassword)}?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace("SignUp")} style={{ marginTop: 15 }}>
          <Text style={style.account}>
            {t(StringConstants.Donthaveanaccountyet)} <Text style={style.span}> {t(StringConstants.SignUp)}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
