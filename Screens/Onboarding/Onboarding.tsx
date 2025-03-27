import React from "react";
import {
  View,
  Text,
  Button,

  Image,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
type Homeprop= StackNavigationProp<StackParamList, 'Home'>;

interface Props {
  navigation: Homeprop;
}
export default function Onboarding({navigation}:Props) {
    function handlePress(){
        navigation.navigate("Login")
    }
  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
      <View style={styles.image}>
        <Image
          source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Group 2.png")}
          style={styles.group2}
        />
        <Image
          source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Group 1.png")}
          style={styles.group1}
        />
        <Image
          source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Coint.png")}
          style={styles.coint}
        />
        <Image
          source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Donut.png")}
          style={styles.donut}
        />
      </View>
      <View style={styles.getstarted}>
        <View style={styles.title}>
        <Text style={styles.save}>Spend Smarter</Text>
        <Text style={styles.save}>Save More</Text>
        </View>
        <View style={styles.button}>
        <LinearGradient colors={["#69AEA9", "#3F8782"]} style={styles.gradient}>
          <TouchableOpacity onPress={()=>navigation.replace("GetStarted")}>
            <Text style={styles.start}>Get started</Text>
          </TouchableOpacity>
        </LinearGradient>
        </View>
        <View style={styles.text}>
        <TouchableOpacity onPress={handlePress}>
        <Text>
          Already Have Account?<Text style={styles.login}> Log in</Text>
        </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  image: {
    flex: 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  group2: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  group1: {
    height:'90%',
    resizeMode:'contain',
    position: "absolute",
    bottom: 0,
  },
  coint: {
    position: "absolute",
    bottom:"72%",
    left:Platform.OS === "ios" ? "18%" : "15%",
    height:'15%',
    width:'20%',
  },
  donut: {
    position: "absolute",
    bottom:Platform.OS === "ios" ? "64%" : "63%",
    height:'15%',
    width:'20%',
    right:Platform.OS === "ios" ? "18%" : "15%",
  },
  save: {
    fontFamily: "Inter",
    fontWeight: 700,
    color: "rgb(67, 136, 131)",
    fontSize: Platform.OS === "ios" ? 30 : 35,
    alignItems: "center",
    justifyContent:'center'
  },
  getstarted: {
    flex: 0.35,
    alignItems: "center",
    justifyContent:'center'
  },
  start: {
    color: "white",
    fontSize: 20,
  
  },
  gradient: {
    width: "80%",
    height: "65%",
    borderRadius: 30,
    alignItems: "center",
        justifyContent:'center',
    shadowColor: "rgb(14, 36, 34)",
    elevation: 20,
  },
  login: {
    color: "rgb(57, 112, 109)",
  },
  title:
  {
    flex:0.4,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    flex:0.35,
    width:'100%',
        justifyContent:'center',
    alignItems:'center',

  },
  text:{
    flex:0.25,
    alignItems:'center',
  }
});
