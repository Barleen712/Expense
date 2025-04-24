import React, { useEffect, useState } from "react";
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
type SignupProp = StackNavigationProp<StackParamList, "SignUp">;

interface Props {
  navigation: SignupProp;
}
export default function SignUp({ navigation }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "26672937768-d1b1daba6ovl6md8bkrfaaffpiugeihh.apps.googleusercontent.com",
    });
  }, []);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [isSelected, changeSelection] = useState(false);
  async function handleSignUp() {
    // try {
    //   const user = await createUserWithEmailAndPassword(auth, email, password);
    //   setLoading(false);
    // } catch (error: any) {
    //   alert(error.message);
    // }
    if (name === "") {
      alert("Enter Name");
      return;
    }
    if (email === "") {
      alert("Enter Email");
      return;
    }
    const emailRegex =
      /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      alert("Please Enter Valid Email");
      return;
    }
    if (password === "") {
      alert("Enter Password");
      return;
    }
    if (password.length < 6) {
      alert("Enter Password of atleast length 6");
      return;
    }
    dispatch(
      addUser({
        name: name,
        email: email,
        password: password,
        google: false,
      })
    );
    setname("");
    setemail("");
    setpass("");
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
  // if (loading) {
  //   return (
  //     <View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
  //     </View>
  //   );
  // }
  return (
    <SafeAreaView style={[styles.container, { alignItems: "center" }]}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <Header title={t(StringConstants.SignUp)} press={() => navigation.goBack()}></Header>
      <View style={style.input}>
        <Input
          title={t(StringConstants.Name)}
          color="rgb(56, 88, 85)"
          css={style.textinput}
          name={name}
          onchange={setname}
          isPass={false}
        />
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
      <View style={{ flexDirection: "row", margin: 20 }}>
        <View style={{ borderWidth: Platform.OS === "ios" ? 1 : 0 }}></View>
        <Text>
          {t(StringConstants.Bysigningupyouagreetothe)}{" "}
          <Text style={{ color: "rgb(57, 112, 109)" }}>{t(StringConstants.TermsofServiceandPrivacyPolicy)}</Text>
        </Text>
      </View>
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
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 20 : 30,
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
