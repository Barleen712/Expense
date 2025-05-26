import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
//import * as ImagePicker from "expo-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import * as FileSystem from "expo-file-system";

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
  setlocalPath: ({ type, path }) => void;
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
  setlocalPath,
}: Images) => {
  const pickImageFromGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperToolbarTitle: "Save",
        freeStyleCropEnabled: true,
      });

      if (image?.path) {
        const fileName = `img_${Date.now()}.jpg`;
        const localPath = FileSystem.documentDirectory + fileName;

        // Save to app storage
        await FileSystem.copyAsync({
          from: image.path,
          to: localPath,
        });

        // Update state with saved path
        setImage(localPath); // use localPath to display saved image
        setlocalPath({ type: "image", path: localPath });
        setAttach(false);
        setclose(true);
        toggle();
      }
    } catch (error) {
      console.error("Gallery pick error:", error);
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
        const fileName = `img_${Date.now()}.jpg`;
        const localPath = FileSystem.documentDirectory + fileName;
        setlocalPath({ type: "document", path: localPath });
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: localPath,
        });
      } else {
        setAttach(true);
        // toggle();
      }
    } catch (err) {
      console.error("Error while picking document:", err);
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 330,
        height: 400,
        cropping: true,
        cropperToolbarTitle: "Save",
        freeStyleCropEnabled: true,
      });

      if (image?.path) {
        const fileName = `img_${Date.now()}.jpg`;
        const localPath = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({
          from: image.path,
          to: localPath,
        });

        setImage(image.path);
        setAttach(false);
        setclose(true);
        setlocalPath({ type: "image", path: localPath });
        toggle();
      }
    } catch (error) {
      console.error("Camera error:", error);
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
