import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { CustomButton } from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearData } from "../../../Slice/IncomeSlice";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { updateUserDoc } from "../../FirestoreHandler";
import * as DocumentPicker from "expo-document-picker";
import { uploadImage } from "../../Constants";
import { getStyles } from "./styles";
import { ThemeContext } from "../../../Context/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
type Profileprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Profileprop;
}
export default function Profile({ navigation }: Props) {
  const [username, setuser] = useState("");
  const [photo, setPhoto] = useState("");
  const [editProfile, seteditProfile] = useState(false);
  const [modalPhoto, setmodalPhoto] = useState("");
  const [modalUser, setModalUser] = useState("");
  const [id, setUserId] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const profilepics = useMemo(
    () => [
      require("../../../assets/women3.jpg"),
      require("../../../assets/man1.jpg"),
      require("../../../assets/Women2.jpg"),
      require("../../../assets/man2.jpg"),
      require("../../../assets/women1.jpg"),
    ],
    []
  );
  const [selectedindex, setselectedindex] = useState();
  async function getData() {
    const user = await getUseNamerDocument();
    setuser(user?.Name);
    setModalUser(user?.Name);
    setmodalPhoto(user?.Photo);
    setUserId(user?.ID);
    if (typeof user?.Photo.uri === "number") {
      setPhoto(profilepics[user?.Index]);
      setselectedindex(user?.Index);
      setmodalPhoto(profilepics[user?.Index]);
    } else {
      setPhoto(user?.Photo);
    }
    if (!user?.Photo) {
      setPhoto(profilepics[1]);
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
      await auth.signOut();
    } catch (error) {
      alert("Their was some error");
    }
  }
  const widths = Dimensions.get("window");
  const { t } = useTranslation();
  async function saveChanges() {
    setPhoto(modalPhoto);
    setuser(modalUser);
    seteditProfile(!editProfile);

    let imageurl = modalPhoto;
    if (typeof modalPhoto === "object" && modalPhoto.uri && modalPhoto.uri.startsWith("file://")) {
      imageurl = await uploadImage(modalPhoto.uri);
    }
    updateUserDoc(id, {
      User: modalUser,
      photo: { uri: imageurl },
      index: index,
    });
  }

  function Discard() {
    seteditProfile(!editProfile);
    setmodalPhoto(photo);
  }
  const pickImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        //setPhoto({ uri: result.assets[0].uri });
        setmodalPhoto({ uri: result.assets[0].uri });
        setselectedindex("");
      } else {
        console.log("User cancelled image selection.");
      }
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ width: widths, height: 800 }} source={require("../../../assets/ProfileBack.png")}>
        <View style={styles.profile}>
          <View style={styles.userphoto}>
            <Image style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 3 }} source={photo} />
          </View>
          <View style={styles.details}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.ForgotDes}>{username}</Text>
          </View>
          <View style={styles.icon}>
            <TouchableOpacity onPress={() => seteditProfile(true)}>
              <Feather name="edit" size={30} color={colors.color} />
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
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.logout}>{t("Logout")}?</Text>
                <Text style={styles.quesLogout}>{t("Are you sure you want to logout?")}</Text>
                <View style={styles.modalButton}>
                  <View style={styles.modalY}>
                    <CustomButton title={t("Yes")} bg="rgb(42, 124, 118)" color="white" press={handleLogout} />
                  </View>
                  <View style={styles.modalN}>
                    <CustomButton title={t("No")} bg={colors.nobutton} color="rgb(42, 124, 118)" press={toggleModal} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
                backgroundColor: colors.backgroundColor,
                marginBottom: 70,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <ScrollView
                    ref={scrollRef}
                    scrollEnabled={Platform.OS === "ios" ? false : true}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TouchableOpacity style={{ position: "absolute", right: "3%" }} onPress={Discard}>
                      <MaterialIcons name="cancel" size={26} color={colors.editColor} />
                    </TouchableOpacity>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        // padding: 20,
                        flex: 0.3,
                        //backgroundColor: "blue",
                      }}
                    >
                      <Image
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 80,
                          borderWidth: 3,
                        }}
                        source={modalPhoto}
                      />
                    </View>
                    <View style={{ margin: 10, flex: 0.4 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                          flex: 1,
                        }}
                      >
                        {profilepics.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={{
                              marginBottom: 5,
                              width: "31%",
                              height: "46%",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 45,
                              backgroundColor: selectedindex === index ? "rgba(4, 73, 69, 0.53)" : "white",
                            }}
                            onPress={() => {
                              setmodalPhoto(profilepics[index]);
                              setselectedindex(index);
                            }}
                          >
                            <Image
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 50,
                                borderWidth: 2,
                                resizeMode: "contain",
                              }}
                              source={item}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        marginTop: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 0.1,
                      }}
                      onPress={() => pickImageFromGallery()}
                    >
                      <Text style={{ color: colors.editColor, fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                        Add Your Custom Profile Picture
                      </Text>
                    </TouchableOpacity>

                    <View style={{ paddingLeft: 10, justifyContent: "space-evenly", flex: 0.1, marginTop: 10 }}>
                      <Text style={{ fontFamily: "Inter", fontSize: 16, color: colors.editColor }}>Username</Text>
                      <TextInput
                        placeholder={username}
                        value={modalUser}
                        maxLength={25}
                        onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        onChangeText={setModalUser}
                        style={{
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontSize: Platform.OS === "ios" ? 24 : 24,
                          color: colors.editColor,
                          borderBottomColor: colors.editColor,
                          borderBottomWidth: 2,
                        }}
                        placeholderTextColor="rgba(4, 73, 69, 0.38)"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={saveChanges}
                      style={{ marginTop: 30, alignItems: "center", justifyContent: "center", flex: 0.1 }}
                    >
                      <Text style={{ color: colors.editColor, fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                        Save Changes
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}
