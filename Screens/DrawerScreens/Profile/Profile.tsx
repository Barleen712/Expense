import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { CustomButton } from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearData } from "../../../Slice/IncomeSlice";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import { persistor } from "../../../Store/Store";
import { updateUserDoc } from "../../FirestoreHandler";
import * as DocumentPicker from "expo-document-picker";
import { uploadImage } from "../../Constants";
import { getStyles } from "./styles";
import { ThemeContext } from "../../../Context/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import ProfileModal from "../../../Components/ProfileModal";
import { profilepics } from "../../Constants";
import { clearUserData } from "../../../utils/userStorage";
import { getRealm, deleteRealmDatabase } from "../../../Realm/realm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
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
  const [selectedindex, setselectedindex] = useState();
  const user = useSelector((state) => state.Money.signup);
  async function getData() {
    const userD = await getUseNamerDocument();
    setuser(user?.User);
    setModalUser(user?.User);
    setmodalPhoto(user?.Photo);
    setUserId(user.ID);
    if (typeof user?.Photo.uri === "number") {
      setPhoto(profilepics[user?.Index]);
      setselectedindex(user?.Index);
      setmodalPhoto(profilepics[user?.Index]);
    } else {
      setPhoto(user?.Photo);
      setmodalPhoto(user?.Photo);
    }
    if (user?.Photo.uri === null) {
      setPhoto(require("../../../assets/user.png"));
      setmodalPhoto(require("../../../assets/user.png"));
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
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      Alert.alert("Network Error", "🚫 No internet connection. Please connect to the internet to log out.");
      toggleModal();
      return;
    }

    toggleModal(); // show spinner/modal immediately

    try {
      // Step 1: Sign out from Firebase first
      try {
        await auth.signOut();
        console.log("✅ Firebase signOut successful");
      } catch (err) {
        console.warn("❌ Firebase signOut failed (possibly offline):", err.message);
        return;
      }

      // Step 2: Clear Redux & persisted data
      dispatch(clearData());
      await clearUserData();
      await persistor.purge();
      console.log("🧹 Redux + persisted data cleared");
      await AsyncStorage.clear();

      // Step 3: Safely close Realm
      try {
        const realm = await getRealm();
        if (realm && !realm.isClosed) {
          realm.close();
          console.log("📁 Realm closed");
        }
      } catch (realmErr) {
        console.error("⚠️ Error closing Realm:", realmErr);
      }

      // Step 4: Delete Realm database file
      try {
        await deleteRealmDatabase();
        console.log("🗑️ Realm database file deleted");
      } catch (deleteErr) {
        console.error("⚠️ Error deleting Realm file:", deleteErr);
      }

      console.log("🚪 User fully logged out");
    } catch (error) {
      console.error("❌ Logout error:", error);
      alert("There was some error during logout.");
    } finally {
      toggleModal(); // hide spinner/modal
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
      Photo: { uri: imageurl },
      Index: selectedindex,
    });
  }
  function Discard() {
    seteditProfile(!editProfile);
    setmodalPhoto(photo);
    setModalUser(username);
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
            <Text style={styles.username}>{t("Username")}</Text>
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
                <Ionicons name="push" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.ExportData)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={toggleModal}>
              <View style={styles.icons}>
                <Ionicons name="log-out" color="rgb(42, 124, 118)" size={30} />
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
        <ProfileModal
          editProfile={editProfile}
          seteditProfile={seteditProfile}
          photo={photo}
          setPhoto={setPhoto}
          modalPhoto={modalPhoto}
          setmodalPhoto={setmodalPhoto}
          selectedindex={selectedindex}
          setselectedindex={setselectedindex}
          profilepics={profilepics}
          username={username}
          modalUser={modalUser}
          setModalUser={setModalUser}
          saveChanges={saveChanges}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
