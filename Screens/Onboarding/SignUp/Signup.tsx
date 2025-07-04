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
  Pressable,
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
  FacebookAuthProvider,
  GithubAuthProvider,
  Auth,
} from "@firebase/auth";
import { auth } from "../../FirebaseConfig";
import { AddUser } from "../../FirestoreHandler";
import * as DocumentPicker from "expo-document-picker";
import { ScrollView } from "react-native-gesture-handler";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { makeRedirectUri, useAuthRequest, ResponseType } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { setLogLevel } from "realm";
import { on } from "stream";
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
  const error = "Password is required";
  function handleChange() {
    setname({ ...name, nameError: "" });
    setemail({ ...email, emailError: "" });
    setpassword({ ...password, error: "" });
  }
  async function handleSignUp() {
    if (name.name === "" && email.email === "" && password.password === "" && checked.state === false) {
      setname({ ...name, nameError: "Name is required" });
      setemail({ ...email, emailError: "Email is required" });
      setpassword({ ...password, error: error });
      setChecked({ ...checked, error: "Kindly agree to the Terms and Policy" });

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
        error: "Password must be Min 8 chars: A–Z, a–z, 0–9, symbol.",
      });
      return;
    }
    if (checked.state === false) {
      setChecked({ ...checked, error: "Kindly agree to the Terms and Policy" });
      return;
    }
    try {
      setloading(true);
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
        setloading(false);
      }
    } catch (error: any) {
      console.log(error);
      raiseToast("error", "Sign Up Failed", error.code);
      setloading(false);
      return;
    }
    setloading(false);
    navigation.navigate("Login");
    setname({ name: "", nameError: "" });
    setemail({ email: "", emailError: "" });
    setpassword({ password: "", error: "" });
    setChecked({ state: false, error: "" });
    setPhoto(require("../../../assets/user.png"));
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
      raiseToast("error", "Google Sign Up Failed", "no-data");
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
  const socialmedialogin = [
    require("../../../assets/facebook.png"),
    require("../../../assets/github-logo.png"),
    require("../../../assets/linkedin.png"),
    require("../../../assets/twitter.png"),
  ];
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const style = getStyles(colors);
  async function onFacebookButtonPress() {
    try {
      // LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
      if (result.isCancelled) {
        throw "User cancelled the login process";
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw "Something went wrong obtaining access token";
      }
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      console.log(facebookCredential);
      const creds = await signInWithCredential(auth, facebookCredential);
      const name = creds.user.displayName;
      const photo = creds.user.photoURL;
      const user = creds.user;
      console.log(name, photo, user);
      try {
        setTimeout(() => {
          AddUser({ User: name, Photo: { uri: photo }, userid: user.uid, index: null, pinSet: false, Google: true });
        }, 1000);
      } catch (e) {
        console.log(e);
      }
      dispatch(
        addUser({
          User: creds.user.displayName,
          Photo: { uri: creds.user.photoURL },
          index: creds.user.uid,
          pin: null,
          Google: true,
        })
      );

      console.log("added", creds.user.uid);
      raiseToast("success", "Sign Up Success", "done");
    } catch (err) {
      console.error(err);
    }
  }
  const clientId = "Ov23liW5edhSzGcERrOa";

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["read:user", "user:email"],
      redirectUri: "https://auth.expo.io/@barleen/ExpenseTracker",
      responseType: ResponseType.Token,
    },
    discovery
  );

  const githublogin = async () => {
    try {
      setloading(true);

      // GitHub OAuth configuration

      // Start the auth flow
      const result = await promptAsync();

      if (result.type === "success") {
        const { access_token } = result.params;

        if (!access_token) {
          throw new Error("No access token received");
        }

        // Get user info
        const [userResponse, emailResponse] = await Promise.all([
          fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` },
          }),
          fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${access_token}` },
          }),
        ]);

        const userData = await userResponse.json();
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email;

        // Create Firebase credential
        const credential = GithubAuthProvider.credential(access_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        console.log(credential);
        // Add user to Firestore
        // await AddUser({
        //   User: userData.name || userData.login,
        //   Photo: { uri: userData.avatar_url },
        //   userid: user.uid,
        //   pinSet: false,
        //   Google: false,
        //   email: primaryEmail,
        // });

        // // Dispatch to Redux
        // dispatch(
        //   addUser({
        //     User: userData.name || userData.login,
        //     Photo: { uri: userData.avatar_url },
        //     index: user.uid,
        //     pin: null,
        //     Google: false,
        //   })
        // );

        // raiseToast("success", "GitHub Login Success", `Welcome ${userData.name || userData.login}`);
      }
    } catch (err: any) {
      console.error("GitHub login failed:", err);
      raiseToast("error", "Login Failed", err.message || "Unknown error");
    } finally {
      setloading(false);
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%", height: height * 0.8 }}>
        <View style={{ alignItems: "center", height: height }}>
          <View style={{ height: height * 0.16, marginTop: 5, width: "100%", alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 0.8, width: "90%", alignItems: "center" }} onPress={pickImageFromGallery}>
              <Image style={{ width: "28%", height: "100%", borderRadius: 100 }} source={photo} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 0.2, justifyContent: "center", marginTop: 10 }}
              onPress={() => pickImageFromGallery()}
            >
              <Text
                style={{
                  color: " rgba(145, 145, 159, 1)",
                  fontSize: 14,
                  height: "100%",
                  textAlignVertical: "center",
                  fontWeight: 600,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                Add Profile Picture
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.input}>
            <View style={{ width: "100%", height: "33%" }}>
              <Input
                ref={nameRef}
                title={t(StringConstants.Name)}
                color="rgba(145, 145, 159, 1)"
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
                    position: "absolute",
                    bottom: "0%",
                    marginLeft: 20,
                    fontFamily: "Inter",
                    width: "90%",
                    fontSize: 12,
                  }}
                >
                  {name.nameError}
                </Text>
              )}
            </View>
            <View style={{ width: "100%", height: "33%" }}>
              <Input
                ref={emailRef}
                title={t(StringConstants.Email)}
                color="rgba(145, 145, 159, 1)"
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
            <View style={{ width: "100%", height: "33%" }}>
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
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              marginTop: 5,
              justifyContent: "space-evenly",
              height: "6.5%",
              // backgroundColor: "pink",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.1 }}>
              <View
                style={{
                  transform: [{ scale: Platform.OS === "ios" ? 0.5 : 1 }],
                  borderWidth: Platform.OS === "ios" ? 2 : 0,
                  borderRadius: 5,
                }}
              >
                <Checkbox
                  status={checked.state ? "checked" : "unchecked"}
                  onPress={() => setChecked({ state: !checked.state, error: checked.state ? checked.error : "" })}
                  color="rgb(57, 112, 109)"
                />
              </View>
            </View>
            <Text style={{ flex: 0.9, color: colors.color, fontWeight: "bold", fontSize: 14 }}>
              {t(StringConstants.Bysigningupyouagreetothe)}{" "}
              <Text
                onPress={() => navigation.navigate("Terms&Services")}
                style={{ color: "rgb(57, 112, 109)", fontSize: 14 }}
              >
                {t(StringConstants.TermsofServiceandPrivacyPolicy)}
              </Text>
            </Text>
            {checked.error !== "" && (
              <Text
                style={{
                  color: "rgb(255, 0, 17)",
                  position: "absolute",
                  bottom: -10,
                  fontFamily: "Inter",
                  width: "90%",
                  fontSize: 12,
                }}
              >
                {checked.error}
              </Text>
            )}
          </View>

          <View style={{ height: "50%", width: "100%", alignItems: "center", marginTop: 5 }}>
            <GradientButton title="Sign Up" handles={handleSignUp} />
            <Text style={style.or}>{t(StringConstants.orwith)}</Text>
            <TouchableOpacity style={style.GoogleView} onPress={GoogleSignIn}>
              <Image style={style.Google} source={require("../../../assets/Google.png")} />
              <Text allowFontScaling={false} style={style.textGoogle}>
                {t(StringConstants.SignUpwithGoogle)}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 20,
                width: "90%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {socialmedialogin.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={onFacebookButtonPress}
                  style={({ pressed }) => [
                    {
                      borderRadius: 30,
                      padding: 8,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                      backgroundColor: pressed ? "rgba(31, 62, 61, 0.34)" : "transparent", // highlight effect
                    },
                  ]}
                >
                  <Image style={style.Google} source={item} />
                </Pressable>
              ))}
            </View>
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
function signInWithRedirect(auth: Auth, provider: GithubAuthProvider) {
  throw new Error("Function not implemented.");
}

function getRedirectResult(auth: Auth) {
  throw new Error("Function not implemented.");
}
