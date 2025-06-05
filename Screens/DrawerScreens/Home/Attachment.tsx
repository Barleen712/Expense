import React from "react";
import { TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ImagePicker from "react-native-image-crop-picker";
import * as FileSystem from "expo-file-system";

interface Images {
  toggle: () => void;
  setAttach: (a: boolean) => void;
  image: string | null;
  setImage: (uri: string) => void;
  setDocument: (uri: string) => void;
  modalItems: Array<any>;
  attach: boolean;
  close: boolean;
  setclose: (a: boolean) => void;
  setlocalPath: ({ type, path }: { type: string; path: string }) => void;
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
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
          "image/heic",
        ],
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
  const Camera = modalItems[0];
  const Image = modalItems[1];
  const Document = modalItems[2];
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
        <Camera />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageFromGallery}>
        <Image />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickDocument}>
        <Document />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SelectImageWithDocumentPicker;
