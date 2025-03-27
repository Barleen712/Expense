import React from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import Header from "../../../Components/Header";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
type AccountProp = StackNavigationProp<StackParamList, 'Account'>;

interface Props {
  navigation: AccountProp;
}
export default function Account({navigation}:Props)
{
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header title="Account" press={()=>navigation.goBack()}/>
                 <View style={styles.accountbg}>
                 <View style={styles.accbalance}>
                 <Text style={styles.accTitle}>Account Balance</Text>
                 <Text style={styles.accamount}>$94500</Text>
                 </View>
                 <ImageBackground style={styles.bg} source={(require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/BG.png"))}/>
               
                 </View>
                <View style={{flex:0.55}}></View>
                <View style={styles.accbutton}>
                <CustomButton title="+ Add new wallet" bg="rgb(42, 124, 118)" color="white"/>
                </View>
             
            </SafeAreaView>
        </SafeAreaProvider>
    )
}