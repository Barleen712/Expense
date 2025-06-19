import React, { useState, useContext, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet, Platform, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import Header from "../../../../../Components/Header";
import { ThemeContext, ThemeContextType } from "../../../../../Context/ThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../../../Navigation/StackList";
type Helprop = StackNavigationProp<StackParamList, "Help">;
interface Props {
  navigation: Helprop;
}
const HelpScreen = ({ navigation }: Props) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const isToggling = useRef(false);

  const toggleFaq = (index: number | null) => {
    if (isToggling.current) return;
    isToggling.current = true;

    setActiveFaq((prev) => (prev === index ? null : index));

    setTimeout(() => {
      isToggling.current = false;
    }, 250);
  };

  const faqs = [
    {
      question: "How to add a new expense?",
      answer: 'Go to the Home screen, tap on "+" and choose "Expense" button in red.',
    },
    {
      question: "How to set a monthly budget?",
      answer:
        'Navigate to Budget tab, select the month and press on "Create a Budget" and enter values for each category.',
    },
    {
      question: "How to categorize my transactions?",
      answer: "While adding an expense/income, select a category from the list.",
    },
    {
      question: "How to edit the Budget",
      answer: 'Go to Budget tab, select the desired budget and press on "Edit" and edit your details',
    },
    {
      question: "In what all formats can i export the data?",
      answer: "You can export the desired data either in CSV or PDF",
    },
    {
      question: "How can i see my monthly report?",
      answer:
        'Navigate to "Transaction" tab and click on "See your Financial Report". It displays the total amount earned,highest earning,total amount spent, highest spend, budget that exceed and your entire transactions.',
    },
    {
      question: "Can I add my own profile picture?",
      answer:
        'Yes, You can!, navigate to Profile tab click on the edit icon and a pop appears, press the "Add Your Custom Profile Picture"butoon, attch image and save the changes',
    },
    {
      question: "How can I see transactions of previous month?",
      answer:
        'Navigate to "Transaction" tab and select the desires month from the month dropdown. This will diplay all the transactions of that particular month.',
    },
  ];

  const { colors } = useContext(ThemeContext) as ThemeContextType;
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Header title="Help" press={() => navigation.goBack()} bgcolor={colors.backgroundColor} color={colors.color} />
      {/* Getting Started */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.section}>
          <Icon name="book-outline" size={24} color="rgba(42, 124, 118, 1)" />
          <View style={styles.sectionText}>
            <Text style={styles.title}>Getting Started</Text>
            <Text style={styles.description}>Learn how to use the app: add expenses, set budgets, and more.</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tutorial")}>
              <Text style={styles.buttonText}>View Tutorial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Icon name="help-circle-outline" size={24} color="rgba(42, 124, 118, 1)" />
          <View style={styles.sectionText}>
            <Text style={styles.title}>FAQs</Text>
            {faqs.map((item, index) => (
              <View key={item.question}>
                <TouchableOpacity onPress={() => toggleFaq(index)} style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Icon
                    name={activeFaq === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="rgba(42, 124, 118, 1)"
                  />
                </TouchableOpacity>
                <Collapsible collapsed={activeFaq !== index}>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </Collapsible>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Icon name="chatbox-ellipses-outline" size={24} color="rgba(42, 124, 118, 1)" />
          <View style={styles.sectionText}>
            <Text style={styles.title}>Need More Help?</Text>
            <Text style={styles.description}>Can’t find what you’re looking for? Get in touch.</Text>
            <TouchableOpacity
              style={styles.buttonOutline}
              onPress={() => Linking.openURL("mailto:support_montra@yopmail.com")}
            >
              <Text style={styles.buttonOutlineText}>Email Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const getStyles = (color: any) => {
  return StyleSheet.create({
    container: {
      backgroundColor: color.about,
      flex: 1,
      alignItems: "center",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
      fontSize: 24,
      fontWeight: "700",
      marginVertical: 10,
      color: "#333",
    },
    section: {
      flexDirection: "row",
      backgroundColor: color.backgroundColor,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    sectionText: {
      marginLeft: 12,
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
      color: color.color,
    },
    description: {
      fontSize: 14,
      color: color.gray,
      marginBottom: 8,
    },
    button: {
      backgroundColor: "rgba(42, 124, 118, 1)",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignSelf: "flex-start",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
    buttonOutline: {
      borderColor: "rgba(42, 124, 118, 1)",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignSelf: "flex-start",
    },
    buttonOutlineText: {
      color: "rgba(42, 124, 118, 1)",
      fontWeight: "600",
    },
    faqItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    faqQuestion: {
      fontWeight: "500",
      color: color.color,
      fontSize: 15,
      flex: 1,
    },
    faqAnswer: {
      color: color.gray,
      fontSize: 14,
      paddingVertical: 4,
      paddingLeft: 4,
    },
    footer: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 12,
      color: "#999",
    },
    scroll: {
      flex: 1,
      width: "90%",
    },
  });
};

export default HelpScreen;
