import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, ImageBackground, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { CustomButton } from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearData } from "../../../Slice/IncomeSlice";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
type Profileprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Profileprop;
}
export default function Profile({ navigation }: Props) {
  const [username, setuser] = useState("");
  const [photo, setPhoto] = useState("");
  const [editProfile, seteditProfile] = useState(false);
  const profilepics = [require("../../../assets/man1.jpg"), require("../../../assets/Women2.png")];
  async function getData() {
    const user = await getUseNamerDocument();
    setuser(user?.Name);
    setPhoto(user?.Photo);
    if (!user?.Photo) {
      setPhoto("https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg?semt=ais_hybrid");
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  async function handleLogout() {
    try {
      toggleModal();
      dispatch(clearData());
      await signOut(auth);
    } catch (error) {
      alert("Their was some error");
    }
  }
  const widths = Dimensions.get("window");
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "rgba(246, 246, 246, 1)" }]}>
      <ImageBackground style={{ width: widths, height: 800 }} source={require("../../../assets/ProfileBack.png")}>
        <View style={styles.profile}>
          <View style={styles.userphoto}>
            <Image style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 3 }} source={{ uri: photo }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.ForgotDes}>{username}</Text>
          </View>
          <View style={styles.icon}>
            <TouchableOpacity onPress={() => seteditProfile(true)}>
              <Image source={require("../../../assets/Button Icon.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.manageProfile}>
          <View style={styles.options}>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Account")}>
              <View style={styles.icons}>
                <Ionicons name="wallet" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Account)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Settings")}>
              <View style={styles.icons}>
                <Ionicons name="settings" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Settings)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Export")}>
              <View style={styles.icons}>
                <Ionicons name="push-outline" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.ExportData)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={toggleModal}>
              <View style={styles.logouticon}>
                <Ionicons name="log-out-outline" color="red" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Logout)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.logout}>{t("Logout")}?</Text>
              <Text style={styles.quesLogout}>{t("Are you sure you want to logout?")}</Text>
              <View style={styles.modalButton}>
                <View style={styles.modalY}>
                  <CustomButton title={t("Yes")} bg="rgb(42, 124, 118)" color="white" press={handleLogout} />
                </View>
                <View style={styles.modalN}>
                  <CustomButton
                    title={t("No")}
                    bg="rgba(220, 234, 233, 0.6)"
                    color="rgb(42, 124, 118)"
                    press={toggleModal}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={editProfile}
          onRequestClose={() => seteditProfile(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={{
                width: "90%",
                height: "80%",
                backgroundColor: "white",
                marginBottom: 70,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View style={[styles.userphoto, { marginTop: 40 }]}>
                <Image style={{ width: 150, height: 150, borderRadius: 80, borderWidth: 3 }} source={{ uri: photo }} />
              </View>
              <View style={{ flex: 0.2 }}>
                <FlatList
                  data={profilepics}
                  numColumns={4}
                  renderItem={({ item }) => (
                    <Image
                      style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 3, resizeMode: "contain" }}
                      source={item}
                    />
                  )}
                />
              </View>
              {/* <TouchableOpacity style={{ flex: 0.15, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "rgba(127, 61, 255, 1)", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                  +{"\n"}
                  Change Profile Picture
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}
