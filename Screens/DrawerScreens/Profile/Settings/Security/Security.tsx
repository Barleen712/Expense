import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { getStyles } from "../Language/styles";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import Header from "../../../../../Components/Header";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { changeSecurity, updatePreferences } from "../../../../../Slice/IncomeSlice";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState, AppDispatch } from "../../../../../Store/Store";
import ReactNativeBiometrics from "react-native-biometrics";
type SecurityProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: SecurityProp;
}
export default function Security({ navigation }: Readonly<Props>) {
  const dispatch = useDispatch<AppDispatch>();
  const security = useSelector((state: RootState) => state.Money.preferences.security);
  const currencies = ["PIN", "Fingerprint"];
  const [selected, setSelected] = useState(security);
  const { t } = useTranslation();
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title="Security"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={async () => {
                if (item === "Fingerprint" || item === "Face ID") {
                  const rnBiometrics = new ReactNativeBiometrics();
                  const { success } = await rnBiometrics.simplePrompt({
                    promptMessage: "Confirm your identity",
                    cancelButtonText: "Cancel",
                  });

                  if (success) {
                    setSelected(item);
                    dispatch(changeSecurity(item));
                    dispatch(updatePreferences("security", item));
                    await AsyncStorage.setItem("biometricEnabled", "true");
                  } else {
                    // Cancelled or failed → fallback to PIN
                    alert("Authentication cancelled.");
                    setSelected("PIN");
                    dispatch(changeSecurity("PIN"));
                    dispatch(updatePreferences("security", "PIN"));
                    await AsyncStorage.setItem("biometricEnabled", "false");
                  }
                } else if (item === "PIN") {
                  setSelected(item);
                  dispatch(changeSecurity(item));
                  dispatch(updatePreferences("security", item));
                  await AsyncStorage.setItem("biometricEnabled", "false");
                }
              }}
              style={styles.items}
            >
              <Text style={styles.itemTitle}>{t(item)}</Text>
              {selected === item && (
                <View style={styles.itemSelected}>
                  <Ionicons name="checkmark-circle" size={20} color="green"></Ionicons>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.Line}></View>
          </View>
        )}
      />
    </View>
  );
}
