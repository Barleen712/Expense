import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

interface Images {
  toggle: () => void;
  setAttach: (a: boolean) => void;
  image: string | null;
  setImage: (uri: string) => void;
  setDocument: (uri: string) => void;
  modalItems: Array<any>;
  setPhoto: (uri: string) => void;
  attach: boolean;
  close: boolean;
  setclose: (a: boolean) => void;
}

const SelectImageWithDocumentPicker = ({
  toggle,
  setAttach,
  image,
  setImage,
  setclose,
  setDocument,
  modalItems,
  attach,
  close,
}: Images) => {
  const pickImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
        setAttach(false);

        setclose(true);
      } else {
        setAttach(true);
      }

      toggle();
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        console.log("Document selected:", result.assets[0].uri);
        setDocument(result.assets[0].uri);
        setAttach(false);
        setclose(true);
        toggle();
      } else {
        setAttach(true);
        toggle();
      }
    } catch (err) {
      console.error("Error while picking document:", err);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to enable camera permissions.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
      setAttach(false);
      setclose(true);
    } else {
      setAttach(true);
      setclose(false);
    }

    toggle();
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={openCamera}>
        <Image source={modalItems[0]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageFromGallery}>
        <Image source={modalItems[1]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickDocument}>
        <Image source={modalItems[2]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SelectImageWithDocumentPicker;
