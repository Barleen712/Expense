import React, { useContext } from "react";
import { View, ScrollView, Text, FlatList } from "react-native";
import getStyles from "./styles";
import { ThemeContext } from "../../../Context/ThemeContext";
import Header from "../../../Components/Header";
import { Terms_Conditions } from "../../Constants";

export default function Terms_Condition({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header
        title="Terms of Service"
        press={() => navigation.goBack()}
        bgcolor={colors.backgroundColor}
        color={colors.color}
      ></Header>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.headTitle}>Terms and Conditons</Text>
          <Text style={styles.head}>
            Welcome to Montra! These Terms and Conditions ("Terms") govern your access to and use of our Expense
            Tracking mobile application ("App") and any related services provided by Chicmic Studios. By using the App,
            you agree to be bound by these Terms. If you do not agree, please do not use the App.
          </Text>
        </View>
        <FlatList
          data={Terms_Conditions}
          contentContainerStyle={{ marginBottom: 50 }}
          renderItem={({ item }) => (
            <View style={styles.TermsView}>
              <Text
                onPress={() => {
                  if (item.title === "3. Privacy") navigation.navigate("Privacy");
                }}
                style={[
                  styles.head,
                  {
                    fontSize: 16,
                    borderBottomColor: colors.line,
                    borderBottomWidth: item.title === "3. Privacy" ? 1 : 0,
                    flexShrink: 1,
                    width: item.title === "3. Privacy" ? "25%" : "90%",
                    color: item.title === "3. Privacy" ? "blue" : "rgba(42, 124, 118, 1)",
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}
