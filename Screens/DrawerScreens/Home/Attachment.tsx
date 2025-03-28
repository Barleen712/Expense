import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const SelectImageWithDocumentPicker = () => {
  const [image, setImage] = useState(null);

  // Pick Image using Document Picker
  const pickImageFromGallery = async () => {
    try {
      // Open document picker with image type filter
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Allow only image files
        multiple: false, // To allow single file selection
        copyToCacheDirectory: true, // Copy file to cache for faster access
      });

      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("User cancelled image selection.");
      }
    } catch (err) {
      console.error("Error while picking image:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
        <Text style={styles.buttonText}>Select Image from Gallery</Text>
      </TouchableOpacity>

      {/* Show Selected Image */}
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.imageText}>✅ Image Selected</Text>
        </View>
      )}
    </View>
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
