import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import GradientButton from "../../../Components/CustomButton";
import Input from "../../../Components/CustomTextInput";
import { Checkbox } from "react-native-paper";
import { getStyles } from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import { useTranslation } from "react-i18next";
import { StringConstants, handleGoogleSignIn, raiseToast, uploadImage } from "../../Constants";
import { addUser, addGoogleUser } from "../../../Slice/IncomeSlice";
import { useDispatch } from "react-redux";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCredential,
  GoogleAuthProvider,
} from "@firebase/auth";
import { auth } from "../../FirebaseConfig";
import { AddUser } from "../../FirestoreHandler";
import * as DocumentPicker from "expo-document-picker";
import { ScrollView } from "react-native-gesture-handler";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
type SignupProp = StackNavigationProp<StackParamList, "SignUp">;
interface Props {
  navigation: SignupProp;
}
const height = Dimensions.get("screen").height;
export default function SignUp({ navigation }: Readonly<Props>) {
  const dispatch = useDispatch();
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [name, setname] = useState({ name: "", nameError: "" });
  const [email, setemail] = useState({ email: "", emailError: "" });
  const [password, setpassword] = useState({ password: "", error: "" });
  const [checked, setChecked] = useState({ state: false, error: "" });
  const [photo, setPhoto] = useState(require("../../../assets/user.png"));
  const [loading, setloading] = useState(false);
  const error = "Enter your password";
  function handleChange() {
    setname({ ...name, nameError: "" });
    setemail({ ...email, emailError: "" });
    setpassword({ ...password, error: "" });
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.email)) {
      setemail({ ...email, emailError: "Enter Valid Email" });
      return;
    }
    if (password.password === "") {
      setpassword({ ...password, error: error });
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+^#])[A-Za-z\d@$!%*?&()_+^#]{8,}$/;
    if (!passwordRegex.test(password.password)) {
      setpassword({
        ...password,
        error: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
      });
      return;
    }
    if (checked.state === false) {
      setChecked({ ...checked, error: "Kindly agree to the Terms and Policy" });
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(auth, email.email, password.password);
      raiseToast("success", "Sign Up Success", "done");
      if (user) {
        const url = await uploadImage(photo.uri);
        AddUser({
          email: email.email.toLocaleLowerCase(),
          User: name.name,
          userid: user.user.uid,
          pinSet: false,
          Photo: {
            uri: url,
          },
          Google: false,
        });
        await sendEmailVerification(user.user);
        await auth.signOut();

        raiseToast("success", "Email Verification", "verify");
      }
    } catch (error: any) {
      console.log(error);
      raiseToast("error", "Sign Up Failed", error.code);
      return;
    }

    navigation.navigate("Login");
    setname({ name: "", nameError: "" });
    setemail({ email: "", emailError: "" });
    setpassword({ password: "", error: "" });
    setChecked({ state: false, error: "" });
  }
  const { t } = useTranslation();
  const pickImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        setPhoto({ uri: result.assets[0].uri });
      } else {
        console.log("User cancelled image selection.");
      }
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };
  async function GoogleSignIn() {
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
    setloading(true);
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
      setloading(false);
      return;
    }

    raiseToast("success", "Sign Up Success", "done");
    AddUser({ User: name, Photo: { uri: photo }, userid: user.uid, index: null, pinSet: false, Google: true });
    setloading(false);
  }
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const style = getStyles(colors);
  if (loading)
    return (
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="rgb(56, 88, 85)" />
      </View>
    );
  return (
    <SafeAreaView style={[style.container, { alignItems: "center" }]}>
      <StatusBar translucent={true} backgroundColor="black" barStyle="default" />
      <Header
        title={t(StringConstants.SignUp)}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      ></Header>
      <ScrollView style={{ width: "100%", height: height * 0.8 }}>
        <View style={{ alignItems: "center", height: height * 0.85 }}>
          <View style={{ height: height * 0.15, marginTop: 5, width: "100%", alignItems: "center" }}>
            <View style={{ flex: 0.8, width: "90%", alignItems: "center" }}>
              <Image style={{ width: "28%", height: "100%", borderRadius: 100 }} source={photo} />
            </View>
            <TouchableOpacity style={{ flex: 0.2, justifyContent: "center" }} onPress={() => pickImageFromGallery()}>
              <Text style={{ color: colors.color }}> Add Profile Picture</Text>
            </TouchableOpacity>
          </View>
          <View style={style.input}>
            <Input
              ref={nameRef}
              title={t(StringConstants.Name)}
              color="rgb(56, 88, 85)"
              css={style.textinput}
              limit={25}
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
                  marginTop: 1,
                  marginBottom: 8,
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
                  marginTop: 1,
                  marginBottom: 8,
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
                  marginTop: 1,
                  marginBottom: 10,
                  marginLeft: 10,
                  fontFamily: "Inter",
                  width: "90%",
                }}
              >
                {password.error}*
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "90%",
              justifyContent: "space-evenly",
              height: "5.5%",
            }}
          >
            <View style={{ borderWidth: Platform.OS === "ios" ? 1 : 0, flex: 0.1 }}>
              <Checkbox
                status={checked.state ? "checked" : "unchecked"}
                onPress={() => setChecked({ state: !checked.state, error: checked.state ? checked.error : "" })}
                color="rgb(57, 112, 109)"
              />
            </View>
            <Text style={{ flex: 0.9, color: colors.color }}>
              {t(StringConstants.Bysigningupyouagreetothe)}{" "}
              <Text onPress={() => navigation.navigate("Terms&Services")} style={{ color: "rgb(57, 112, 109)" }}>
                {t(StringConstants.TermsofServiceandPrivacyPolicy)}
              </Text>
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
          <View style={{ height: "50%", width: "100%", alignItems: "center", marginTop: 5 }}>
            <GradientButton title="Sign Up" handles={handleSignUp} />
            <Text style={style.or}>{t(StringConstants.orwith)}</Text>
            <TouchableOpacity style={style.GoogleView} onPress={GoogleSignIn}>
              <Image style={style.Google} source={require("../../../assets/Google.png")} />
              <Text style={style.textGoogle}>{t(StringConstants.SignUpwithGoogle)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={style.account}>
                {t(StringConstants.Alreadyhaveanaccount)} <Text style={style.span}>{t(StringConstants.Login)}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
