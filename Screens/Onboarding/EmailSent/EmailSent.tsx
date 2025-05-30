import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import { CustomButton } from "../../../Components/CustomButton";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { ThemeContext, ThemeContextType } from "../../../Context/ThemeContext";
import { getStyles } from "./styles";
type EmailSentProp = StackNavigationProp<StackParamList, "EmailSent">;

interface Props {
  navigation: EmailSentProp;
  route: {
    params: {
      email: string;
    };
  };
}
export default function EmailSent({ navigation, route }: Readonly<Props>) {
  const { t } = useTranslation();
  const { email } = route.params;
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <View style={styles.emailImgView}>
        <Image style={styles.emailImg} source={require("../../../assets/mail.png")} />
      </View>
      <View style={styles.emailDes}>
        <Text style={styles.ForgotDes}>{t(StringConstants.Youremailisontheway)}</Text>
        <Text style={styles.emailDesText}>
          "Check your email {email} and follow the instructions to reset your password
        </Text>
        <View style={styles.backToLogin}>
          <CustomButton
            title={t(StringConstants.BacktoLogin)}
            bg="rgb(42, 124, 118)"
            color="white"
            press={() => navigation.popTo("Login")}
          />
        </View>
      </View>
    </View>
  );
}
