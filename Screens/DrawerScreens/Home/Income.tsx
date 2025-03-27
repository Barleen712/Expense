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
type IncomeProp = StackNavigationProp<StackParamList, 'Income'>;

interface Props {
  navigation: IncomeProp;
}
const category=["Shopping","Food","Entertainment","Savings","Transportation","Bills","Miscellaneous"]
export default function Income({navigation}:Props)
{
    const [Expense,setExpense]=useState(false)
     const [isOpen,setOpen]=useState(false)
     const [showAlert,setAlert]=useState(true)
    return(
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
             <Header title="Income"
              press={()=>navigation.goBack()} bgcolor="rgba(0, 168, 107, 1)" color="white"/>
          <View style={[styles.add,{backgroundColor:"rgba(0, 168, 107, 1))"}]}>
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
                <CustomButton title="Continue" bg="rgba(173, 210, 189, 0.6)" color="rgb(42, 124, 118)" press={()=>navigation.goBack()}/>
            </View>)}
     
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    )
}