import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
type LanguageProp = StackNavigationProp<StackParamList, "Account">;

interface Props {
  navigation: LanguageProp;
}
export default function Language({ navigation }: Props) {
  const currencies = [
    { name: "Arabic", code: "AR" },
    { name: "Chinese", code: "ZH" },
    { name: "Dutch", code: "RUB" },
    { name: "English", code: "EN" },
    { name: "French", code: "FR" },
    { name: "German", code: "DE" },
    { name: "Hindi", code: "HI" },
    { name: "India", code: "INR" },
    { name: "Indonesian", code: "ID" },
    { name: "Italian", code: "IT" },
    { name: "Korean", code: "KO" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  return (
    <View style={styles.container}>
      <Header title="Language" press={() => navigation.goBack()} />
      <View style={styles.Line}></View>
      <FlatList
        style={styles.settings}
        data={currencies}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => setSelectedLanguage(item.code)} style={styles.items}>
              <Text style={styles.itemTitle}>
                {item.name} ({item.code})
              </Text>
              {selectedLanguage === item.code && (
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
