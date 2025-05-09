import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { Privacy_Policy } from "../../../Constants";
import { ThemeContext } from "../../../../Context/ThemeContext";
import getStyles from "../styles";
import Header from "../../../../Components/Header";
export default function Privacy({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
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
              <Text>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
