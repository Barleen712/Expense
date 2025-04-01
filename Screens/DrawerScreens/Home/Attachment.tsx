import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const SelectImageWithDocumentPicker = ({ toggle, setAttach, image, setImage, setclose }) => {
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
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Camera.png")}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageFromGallery}>
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Image.png")}></Image>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Document.png")}></Image>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },
});

export default SelectImageWithDocumentPicker;
