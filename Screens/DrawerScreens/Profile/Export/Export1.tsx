import React from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../../Stylesheet";
import { CustomButton } from "../../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../Navigation/StackList";
import { useTranslation } from "react-i18next";
type Export1Prop = StackNavigationProp<StackParamList, "Export">;

interface Props {
  navigation: Export1Prop;
}
export default function Export1({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.export1}>
        <View style={styles.exportimg}>
          <Image source={require("../../../../assets/Export.png")} />
        </View>
        <View style={styles.exportimg}>
          <Text style={styles.Export1text}>
            {t(
              "Check your email, we send you the financial report. In certain cases, it might take a little longer, depending on the time period and the volume of activity."
            )}
          </Text>
        </View>
      </View>

      <View style={styles.exportButton}>
        <CustomButton
          title={t("Back to Home")}
          bg="rgb(42, 124, 118)"
          color="white"
          press={() => navigation.navigate("MainScreen")}
        />
      </View>
    </View>
  );
}
