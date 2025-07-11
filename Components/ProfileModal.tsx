import React, { useContext, useRef, useMemo, useCallback, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  Image,
  ImageSourcePropType,
  Pressable,
  FlatList,
} from "react-native";
import styles from "../Screens/Stylesheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import * as DocumentPicker from "expo-document-picker";
import PhotoModal from "./PhotoModal";
type ProfilePhotoSource = string | number | { uri: string };

interface ProfileModalProps {
  editProfile: boolean;
  seteditProfile: (value: boolean) => void;
  photo: ProfilePhotoSource;
  setPhoto: (value: string | number | { uri: string }) => void;
  modalPhoto: ProfilePhotoSource;
  setmodalPhoto: (value: string | number | { uri: string }) => void;
  selectedindex: number | undefined;
  setselectedindex: (value: number | undefined | string) => void;
  profilepics: any[];
  username: string;
  modalUser: string;
  setModalUser: (value: string) => void;
  saveChanges: () => void;
  usernameError: string;
  setusernameError: (value: string) => void;
  index: null | number | string;
}
const MemoizedImage = React.memo(({ source }: { source: ImageSourcePropType }) => {
  return (
    <Image
      style={{
        width: 150,
        height: 150,
        borderRadius: 80,
        borderWidth: 3,
      }}
      source={source}
    />
  );
});
const Thumbnail = React.memo(
  ({
    item,
    index,
    selectedindex,
    onPress,
    colors,
  }: {
    item: ImageSourcePropType;
    index: number;
    selectedindex: number | "";
    onPress: () => void;
    colors: {
      selected: string;
      backgroundColor: string;
      [key: string]: any;
    };
  }) => {
    return (
      <Pressable
        style={{
          marginBottom: 5,
          width: 90,
          height: 90,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Platform.OS === "android" ? 45 : 55,
          backgroundColor: selectedindex === index ? colors.selected : colors.backgroundColor,
          // backgroundColor: "blue",
        }}
        onPress={onPress}
      >
        <FastImage
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            borderWidth: 2,
          }}
          source={
            typeof item === "number"
              ? item
              : {
                  ...(typeof item === "object" && !Array.isArray(item) ? item : { uri: String(item) }),
                  cache: "web",
                }
          }
          resizeMode={FastImage.resizeMode.contain}
        />
      </Pressable>
    );
  }
);
function ProfileModal({
  editProfile,
  seteditProfile,
  photo,
  setPhoto,
  modalPhoto,
  setmodalPhoto,
  selectedindex,
  setselectedindex,
  profilepics,
  username,
  modalUser,
  setModalUser,
  saveChanges,
  usernameError,
  setusernameError,
  index,
}: Readonly<ProfileModalProps>) {
  const scrollRef = useRef<ScrollView>(null);
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const { t } = useTranslation();
  // Discard changes
  const Discard = useCallback(() => {
    seteditProfile(false);
    setmodalPhoto(photo);
    setModalUser(username);
    setselectedindex(selectedindex);
  }, [photo, username]);

  const pickImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setmodalPhoto({ uri: result.assets[0].uri });
        setselectedindex("");
      }
      setshowModal(false);
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };

  const isSaveDisabled = useMemo(
    () => modalPhoto === photo && modalUser === username,
    [modalPhoto, photo, modalUser, username]
  );
  const [showmodal, setshowModal] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={editProfile}
      onRequestClose={() => {
        if (editProfile) Discard();
        seteditProfile(false);
      }}
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
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <ScrollView
              bounces={false}
              ref={scrollRef}
              contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity style={{ position: "absolute", right: "3%" }} onPress={Discard}>
                <MaterialIcons name="cancel" size={26} color={colors.editColor} />
              </TouchableOpacity>

              <View style={{ alignItems: "center", justifyContent: "center", flex: 0.3 }}>
                <MemoizedImage source={typeof modalPhoto === "string" ? { uri: modalPhoto } : modalPhoto} />
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
                  {/* {profilepics.map((item, index) => (
                    <Thumbnail
                      key={typeof item === "string" ? item : JSON.stringify(item)}
                      item={item}
                      index={index}
                      colors={colors}
                      selectedindex={selectedindex ?? ""}
                      onPress={() => {
                        setmodalPhoto(item);
                        setselectedindex(index);
                      }}
                    />
                  ))} */}
                  <FlatList
                    data={profilepics}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => (typeof item === "string" ? item : JSON.stringify(item) + index)}
                    numColumns={3}
                    renderItem={({ item, index }) => (
                      <Thumbnail
                        item={item}
                        index={index}
                        colors={colors}
                        selectedindex={selectedindex ?? ""}
                        onPress={() => {
                          setmodalPhoto(item);
                          setselectedindex(index);
                        }}
                      />
                    )}
                    contentContainerStyle={{
                      margin: "auto",
                      flex: 1,
                      marginTop: 10,
                      // backgroundColor: "red",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    initialNumToRender={6}
                    // windowSize={5}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 0.1,
                  width: "60%",
                  backgroundColor: colors.seeall,
                  padding: 5,
                  borderRadius: 20,
                }}
                onPress={() => setshowModal(true)}
                // onPress={pickImageFromGallery}
              >
                <PhotoModal
                  showModal={showmodal}
                  setshowModal={setshowModal}
                  onEdit={() => {
                    setTimeout(() => {
                      pickImageFromGallery();
                    }, 200);
                  }}
                  onDelete={() => {
                    setmodalPhoto(require("../assets/user.png"));
                    setshowModal(false);
                    setselectedindex("");
                  }}
                  disable={typeof photo === "object" ? false : typeof index === "number" ? false : true}
                />
                <Text style={{ color: colors.editColor, fontWeight: "bold", fontSize: 18 }}>
                  {t("Edit Profile Picture")}
                </Text>
              </TouchableOpacity>

              <View style={{ paddingLeft: 10, justifyContent: "space-evenly", flex: 0.1, marginTop: 10, width: "90%" }}>
                <Text style={{ fontFamily: "Inter", fontSize: 16, color: colors.editColor }}>{t("Username")}</Text>
                <TextInput
                  value={modalUser}
                  maxLength={25}
                  onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                  onChangeText={(text) => {
                    const cleanedText = text.trimStart();
                    const allowed = /^[a-zA-Z ]*$/;

                    if (allowed.test(cleanedText)) {
                      setusernameError("");
                      setModalUser(cleanedText);
                    } else {
                      setusernameError("Only letters and spaces are allowed");
                    }
                  }}
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "600",
                    fontSize: 24,
                    color: colors.editColor,
                    borderBottomColor: colors.editColor,
                    borderBottomWidth: 2,
                  }}
                  placeholderTextColor="rgba(4, 73, 69, 0.38)"
                />
                {!!usernameError && <Text style={{ color: "red" }}>{usernameError}*</Text>}
              </View>

              <TouchableOpacity
                disabled={isSaveDisabled}
                onPress={saveChanges}
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 0.1,
                }}
              >
                <Text
                  style={{
                    color: isSaveDisabled ? "gray" : colors.editColor,
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "center",
                    padding: 5,
                    borderRadius: 18,
                    width: "50%",
                    backgroundColor: isSaveDisabled ? "rgba(158, 158, 163, 0.9)" : colors.seeall,
                  }}
                >
                  {t("Save Changes")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}
export default React.memo(ProfileModal);
