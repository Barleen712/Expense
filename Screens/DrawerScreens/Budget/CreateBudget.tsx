import React, { useState } from "react";
import { View, Text, Button, Image, TouchableOpacity ,Switch} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { CustomButton } from "../../../Components/CustomButton";
import DropDown from "../../../Components/DropDown";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
import CustomSlider from "../../../Components/Slider";
type CreateBudgetProp = StackNavigationProp<StackParamList, 'CreateBudget'>;

interface Props {
  navigation: CreateBudgetProp;
}
const category=["Shopping","Food","Entertainment","Savings","Transportation","Bills","Miscellaneous"]
export default function CreateBudget({navigation}:Props)
{
    const [Expense,setExpense]=useState(false)
     const [isOpen,setOpen]=useState(false)
     const [showAlert,setAlert]=useState(true)
    return(
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
             <Header title="Create Budget" press={()=>navigation.goBack()} bgcolor="rgb(56, 88, 85)" color="white"/>
          <View style={styles.add}>
            <View style={styles.balanceView}>
              <Text style={styles.balance}>How much do you want to spend ?</Text>
              <Text style={styles.amount}>$00.0</Text>
            </View>
            <View style={styles.selection}>
            
            <DropDown name="Category" data={category} open={isOpen} setopen={()=>
              {setOpen(!isOpen)
                setAlert(!showAlert)
              }}/>
           { showAlert && (<View style={styles.dropdown}>

            <View style={styles.notiView}>
                   <View style={styles.noti}>
                   <Text style={styles.notiTitle}>Receive Alert</Text>
                   <Text style={styles.notiDes}>Receive alert when it reaches some point</Text>
                   </View>
                    <View style={styles.switch}>
                        <Switch trackColor={{false:'rgba(220, 234, 233, 0.6)',true:"rgb(42, 124, 118)"}} value={Expense} thumbColor={"white"} onValueChange={setExpense}/>
                    </View>
                </View>
               {Expense && (<CustomSlider/>)}
                <CustomButton title="Continue" bg="rgb(42, 124, 118)" color="white" press={()=>navigation.goBack()}/>
            </View>)}
            
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    )
}