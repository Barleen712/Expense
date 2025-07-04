import React, { useContext } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { Privacy_Policy } from "../../../Constants";
import { ThemeContext, ThemeContextType } from "../../../../Context/ThemeContext";
import getStyles from "../styles";
import Header from "../../../../Components/Header";
export default function Privacy({ navigation }: any) {
  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Privacy Policy"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      ></Header>
      <View style={styles.scrollView}>
        <FlatList
          data={Privacy_Policy}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.TermsView}>
              <Text style={styles.head}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
