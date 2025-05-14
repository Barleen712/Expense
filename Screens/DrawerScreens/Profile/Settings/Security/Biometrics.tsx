import React from "react";
import { View, Button, Alert } from "react-native";
import ReactNativeBiometrics, { FaceID } from "react-native-biometrics";
import { changeSecurity } from "../../../../../Slice/IncomeSlice";
import { updatePreferences } from "../../../../../Slice/IncomeSlice";
const rnBiometrics = new ReactNativeBiometrics();

const BiometricAuth = () => {
  const handleBiometricAuth = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (biometryType === FaceID) {
      console.log("supported");
    }
    if (available) {
      let typeMessage = "";
      switch (biometryType) {
        case ReactNativeBiometrics.TouchID:
          typeMessage = "Touch ID is available";
          break;
        case ReactNativeBiometrics.FaceID:
          typeMessage = "Face ID is available";
          break;
        case ReactNativeBiometrics.Biometrics:
          typeMessage = "Biometric authentication is available";
          break;
        default:
          typeMessage = "Unknown biometric type";
      }

      Alert.alert("Biometric Type", typeMessage);

      rnBiometrics
        .simplePrompt({ promptMessage: "Confirm your identity" })
        .then((resultObject) => {
          const { success } = resultObject;

          if (success) {
            if (biometryType === "TouchID") {
              changeSecurity("Fingerprint");
              dispatch(updatePreferences("security", "Fingerprint"));
            }

            Alert.alert("Success", "Biometric authentication successful");
          } else {
            Alert.alert("Failed", "Biometric authentication cancelled");
          }
        })
        .catch(() => {
          Alert.alert("Error", "Biometric authentication failed");
        });
    } else {
      Alert.alert("Error", "Biometrics not supported on this device");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Login with Biometrics" onPress={handleBiometricAuth} />
    </View>
  );
};

export default BiometricAuth;
