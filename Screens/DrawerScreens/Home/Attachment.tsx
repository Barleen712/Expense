import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
interface Images {
  toggle: () => void;
  setAttach: () => void;
  image: string | null;
  setImage: (uri: string) => void;
  setclose: () => void;
  setDocument: (uri: string) => void;
  modalItems: Array<any>;
}

const SelectImageWithDocumentPicker = ({
  toggle,
  setAttach,
  image,
  setImage,
  setclose,
  setDocument,
  modalItems,
}: Images) => {
  const pickImageFromGallery = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("User cancelled image selection.");
      }

      setAttach();
      setclose();
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

      if (!result.canceled) {
        console.log("Document selected:", result.assets[0].uri);
        setDocument(result.assets[0].uri);
      } else {
        console.log("User cancelled document selection.");
      }

      setAttach();
      setclose();
      toggle();
    } catch (err) {
      console.error("Error while picking document:", err);
    }
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
      <TouchableOpacity>
        <Image source={modalItems[0]}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageFromGallery}>
        <Image source={modalItems[1]}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickDocument}>
        <Image source={modalItems[2]}></Image>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SelectImageWithDocumentPicker;
