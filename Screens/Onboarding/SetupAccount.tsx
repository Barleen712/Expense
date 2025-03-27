import React,{useState}from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../Stylesheet";
import { CustomButton } from "../../Components/CustomButton";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
type SetupAccountProp = StackNavigationProp<StackParamList, 'SetupAccount'>;

interface Props {
  navigation: SetupAccountProp;
}
export default function SetupAccount({navigation}:Props)
{

    return(
        <SafeAreaProvider >
            <SafeAreaView style={styles.container}>
             <View style={styles.headView}>
                <Text style={styles.heading}>Let’s setup your account!</Text>
             </View>
             <View style={styles.desAccount}>
             <Text style={styles.destext}>Account can be your bank, credit card or 
             your wallet.</Text>
             </View>
             <View style={styles.letsgo}>
                <View style={styles.gobutton}>
                <CustomButton title="Let's go" bg="rgb(42, 124, 118)" color="white" press={()=>navigation.navigate("AddNewAccount")}/>
                </View>
             </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}