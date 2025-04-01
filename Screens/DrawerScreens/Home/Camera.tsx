import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Image } from "react-native";
import { Camera } from "expo-camera";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Request camera permissions
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestPermission();
  }, []);

  // If no camera permission or camera device, show the respective messages
  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Function to take a picture
  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({
        qualityPrioritization: "quality",
      });
      setPhoto(photo.uri); // Store the URI of the captured photo
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={setCamera}
        style={styles.camera}
        type={Camera.Type.back} // Use the back camera
      />
      <Button title="Take Picture" onPress={takePicture} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
