import React, { useContext, useEffect, useState } from "react";
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
import { StringConstants, uploadImage, profilepics } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearData, updateUser } from "../../../Slice/IncomeSlice";
import { persistor, RootState } from "../../../Store/Store";
import { updateUserDoc } from "../../FirestoreHandler";
import { getStyles } from "./styles";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import ProfileModal from "../../../Components/ProfileModal";
import { clearUserData } from "../../../utils/userStorage";
import { getRealm, deleteRealmDatabase } from "../../../Realm/realm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { syncPendingDeletes, syncPendingUpdatesToFirestore, syncUnsyncedTransactions } from "../../../Realm/Sync";
import {
  syncPendingDeletesBudget,
  syncUnsyncedBudget,
  syncPendingUpdatesToFirestoreBudgets,
} from "../../../Realm/SyncBudget";
type Profileprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Profileprop;
}
export default function Profile({ navigation }: Readonly<Props>) {
  const { isConnected } = useNetInfo();
  const [username, setusername] = useState("");
  const [photo, setPhoto] = useState<string | { uri: string } | number>("");
  const [editProfile, seteditProfile] = useState(false);
  const [modalPhoto, setmodalPhoto] = useState<string | { uri: string } | number>("");
  const [modalUser, setModalUser] = useState("");
  const [selectedindex, setselectedindex] = useState<number | undefined>();
  const user = useSelector((state: RootState) => state.Money.signup);
  async function getData() {
    setusername(user?.User);
    setModalUser(user?.User);
    if (typeof user?.Photo.uri === "number") {
      if (typeof user?.index === "number") {
        setPhoto(profilepics[user.index]);
        setselectedindex(user.index);
        setmodalPhoto(profilepics[user.index]);
      }
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
        syncUnsyncedTransactions();
        syncPendingDeletes({ isConnected });
        syncPendingUpdatesToFirestore();
        syncUnsyncedBudget();
        syncPendingDeletesBudget({ isConnected });
        syncPendingUpdatesToFirestoreBudgets();
        await auth.signOut();
      } catch (err) {
        return;
      }

      dispatch(clearData());
      await clearUserData();
      await persistor.purge();

      await AsyncStorage.clear();

      try {
        const realm = await getRealm();
        if (realm && !realm.isClosed) {
          realm.close();
        }
      } catch (realmErr) {
        console.error("⚠️ Error closing Realm:", realmErr);
      }
      try {
        await deleteRealmDatabase();
      } catch (deleteErr) {
        console.error("⚠️ Error deleting Realm file:", deleteErr);
      }
    } catch (error) {
      alert("There was some error during logout.");
    } finally {
      toggleModal();
    }
  }

  const widths = Dimensions.get("window").width;
  const { t } = useTranslation();
  async function saveChanges() {
    setPhoto(modalPhoto);
    setusername(modalUser);
    seteditProfile(!editProfile);

    let imageurl = modalPhoto;
    if (typeof modalPhoto === "object" && modalPhoto.uri && modalPhoto.uri.startsWith("file://")) {
      const uploaded = await uploadImage(modalPhoto.uri);
      imageurl = uploaded ?? "";
    }

    dispatch(updateUser({ Photo: imageurl, Index: selectedindex, username: modalUser }));
    if (auth.currentUser?.uid) {
      updateUserDoc(auth.currentUser.uid, {
        User: modalUser,
        Photo: { uri: imageurl },
        index: selectedindex ?? null,
        pin: user.pin,
        userId: auth.currentUser.uid,
      });
    }
  }
  function Discard() {
    seteditProfile(!editProfile);
    setmodalPhoto(photo);
    setModalUser(username);
  }
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={{ width: widths, height: 800 }} source={require("../../../assets/ProfileBack.png")}>
        <View style={styles.profile}>
          <View style={styles.userphoto}>
            <Image
              style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 3 }}
              source={typeof photo === "string" ? require("../../../assets/user.png") : photo}
            />
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
