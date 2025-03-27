import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity ,Switch, ImageBackground} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import DropDown from "../../../Components/DropDown";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import CustomSlider from "../../../Components/Slider";
import Input from "../../../Components/CustomTextInput";
type ExpenseProp = StackNavigationProp<StackParamList, 'Expense'>;

interface Props {
  navigation: ExpenseProp;
}
const category=["Shopping","Food","Entertainment","Savings","Transportation","Bills","Miscellaneous"]
export default function Expense({navigation}:Props)
{
    const [Expense,setExpense]=useState(false)
     const [isOpen,setOpen]=useState(false)
     const [showAlert,setAlert]=useState(true)
    return(
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
             <Header title="Expense" press={()=>navigation.goBack()} bgcolor="rgba(253, 60, 74, 1)" color="white"/>
          <View style={[styles.add,{backgroundColor:"rgba(253, 60, 74, 1)"}]}>
            <View style={styles.balanceView}>
              <Text style={styles.balance}>How much ?</Text>
              <Text style={styles.amount}>$0</Text>
            </View>
            <View style={[styles.selection]}>
            
            <DropDown name="Category" data={category} open={isOpen} setopen={()=>
              {setOpen(!isOpen)
                setAlert(!showAlert)
              }}/>
           { showAlert && (<View style={styles.dropdown}>
            <Input title="Description" color="rgb(56, 88, 85)" css={styles.textinput} isPass={false} />

            <DropDown name="Wallet" data={category} open={isOpen} setopen={()=>
              {setOpen(!isOpen)
                setAlert(!showAlert)
              }}/>
              <View style={[styles.textinput,{borderStyle:'dashed',alignItems:'center'}]}>
                <Text>Add attachment</Text>
                </View>
                <CustomButton title="Continue" bg="rgba(234, 225, 220, 0.6)" color="red" press={()=>navigation.goBack()}/>
            </View>)}
     
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    )
}