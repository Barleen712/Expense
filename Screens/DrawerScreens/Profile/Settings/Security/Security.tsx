import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { getStyles} from "./styles"
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
import Header from "../../../../../Components/Header";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { changeSecurity } from "../../../../../Slice/IncomeSlice";
import { ThemeContext } from "../../../../../Context/ThemeContext";
type SecurityProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: SecurityProp;
}
export default function Security({ navigation }: Props) {
  const dispatch = useDispatch();
  const security = useSelector((state) => state.Money.preferences.security);
  const currencies = ["PIN", "Fingerprint", "Face ID"];
  const [selected, setSelected] = useState(security);
  const { t } = useTranslation();
  const {colors}=useContext(ThemeContext)
  const styles=getStyles(colors)
  return (
    <View style={styles.container}>
      <Header title="Security" press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color}/>
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelected(item);
                dispatch(changeSecurity(item));
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
