import React, { useContext, useState } from "react";
import { View, Image, ScrollView, Dimensions, Text, Alert } from "react-native";
import Header from "../../../../Components/Header";
import { ThemeContext } from "../../../../Context/ThemeContext";
import Input from "../../../../Components/CustomTextInput";
import styles from "../../../Stylesheet";
import { CustomButton } from "../../../../Components/CustomButton";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../../FirebaseConfig";
const height = Dimensions.get("screen").height;
export default function ForgotPin({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  async function next() {
    if (!password || !confirmPass) {
      Alert.alert("Error", "Please fill both fields.");
      setPassword("");
      setconfirmPass("");
      return;
    }

    if (password !== confirmPass) {
      Alert.alert("Error", "Passwords do not match.");
      setPassword("");
      setconfirmPass("");
      return;
    }
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);

      Alert.alert("Success", "Password verified.");
      navigation.navigate("Setpin");
    } catch (error) {
      Alert.alert("Failed", "Please enter correct Password");
      setPassword("");
      setconfirmPass("");
    }
  }
  return (
    <View style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
      <Header
        title={"Forgot Pin"}
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <ScrollView style={{ width: "100%", flex: 1 }}>
        {/* <View style={{ width: "100%", height: "100%", backgroundColor: "blue" }}> */}
        <View style={{ alignItems: "center", height: height * 0.4 }}>
          <Image
            style={{ width: "80%", height: "100%", resizeMode: "contain" }}
            source={require("../../../../assets/Forgot.png")}
          />
        </View>
        <View style={{ alignItems: "center", height: height * 0.42, justifyContent: "space-evenly" }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: "Inter", fontSize: 30, color: colors.color, fontWeight: "bold" }}>
              Enter Password 🔐
            </Text>
          </View>
          <Input
            title={"Password"}
            color="rgb(56, 88, 85)"
            css={styles.textinput}
            name={password}
            onchange={(data) => {
              setPassword(data);
            }}
            isPass={true}
          />
          <Input
            title={"Confirm Password"}
            color="rgb(56, 88, 85)"
            css={styles.textinput}
            name={confirmPass}
            onchange={(data) => {
              setconfirmPass(data);
            }}
            isPass={true}
          />
          <CustomButton title={"Next"} bg="rgb(57, 112, 109)" color="white" press={next} />
        </View>
      </ScrollView>
    </View>
  );
}
