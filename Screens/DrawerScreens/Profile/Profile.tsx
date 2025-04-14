import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
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
type Profileprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Profileprop;
}
export default function Profile({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  async function handleLogout() {
    try {
      toggleModal();
      await signOut(auth);
      navigation.replace("Home");
    } catch (error) {
      alert("Their was some error");
    }
  }
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.profile}>
        <View style={styles.userphoto}>
          <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Profile.png")} />
        </View>
        <View style={styles.details}>
          <Text style={styles.username}>Username</Text>
          <Text style={styles.ForgotDes}>Iriana Saliha</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Button Icon.png")} />
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
            <Text style={styles.logout}>Logout?</Text>
            <Text style={styles.quesLogout}>Are you sure do you want to logout?</Text>
            <View style={styles.modalButton}>
              <View style={styles.modalY}>
                <CustomButton title="Yes" bg="rgb(42, 124, 118)" color="white" press={handleLogout} />
              </View>
              <View style={styles.modalN}>
                <CustomButton title="No" bg="rgba(220, 234, 233, 0.6)" color="rgb(42, 124, 118)" press={toggleModal} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
