import React, { useContext, useRef, useMemo, useCallback } from "react";
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
} from "react-native";
import styles from "../Screens/Stylesheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemeContext, ThemeContextType } from "../Context/ThemeContext";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import * as DocumentPicker from "expo-document-picker";
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
          width: "31%",
          height: "46%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 45,
          backgroundColor: selectedindex === index ? colors.selected : colors.backgroundColor,
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
                  cache: "immutable",
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
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };

  const isSaveDisabled = useMemo(
    () => modalPhoto === photo && modalUser === username,
    [modalPhoto, photo, modalUser, username]
  );
  return (
    <Modal animationType="slide" transparent visible={editProfile} onRequestClose={() => seteditProfile(false)}>
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
              ref={scrollRef}
              contentContainerStyle={{ flexGrow: 1 }}
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
                  {profilepics.map((item, index) => (
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
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 0.1,
                  backgroundColor: colors.seeall,
                  padding: 5,
                  borderRadius: 20,
                }}
                onPress={pickImageFromGallery}
              >
                <Text style={{ color: colors.editColor, fontWeight: "bold", fontSize: 18 }}>
                  {t("Add Your Custom Profile Picture")}
                </Text>
              </TouchableOpacity>

              <View style={{ paddingLeft: 10, justifyContent: "space-evenly", flex: 0.1, marginTop: 10 }}>
                <Text style={{ fontFamily: "Inter", fontSize: 16, color: colors.editColor }}>{t("Username")}</Text>
                <TextInput
                  placeholder={username}
                  value={modalUser}
                  maxLength={25}
                  onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                  onChangeText={(text) => {
                    setusernameError("");
                    setModalUser(text);
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
                {usernameError && <Text style={{ color: "red" }}>{usernameError}*</Text>}
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
