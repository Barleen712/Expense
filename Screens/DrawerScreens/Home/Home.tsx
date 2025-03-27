import React ,{useState}from "react";
import {View,Text, TouchableOpacity,Image, Platform,Dimensions} from "react-native"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../Stylesheet";
import Months from "../../../Components/Month";
import { LineChart } from "react-native-chart-kit";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
type Homeprop = StackNavigationProp<StackParamList, 'MainScreen'>;

interface Props {
  navigation: Homeprop;
}

const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
    {
    data: [20, 45, 28, 80, 99, 43,45,79,90.89,40,40,40,46,66,34,5,43,76,20,20,20,20],
    color: () => `rgba(90, 9, 252, 0.93)`, // optional
    strokeWidth: 4// optional
    }
    ],
    }
export default function Home({navigation}:Props)
{
    const [month,showmonth]=useState(false)
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
            <LinearGradient colors={["rgba(255, 246, 229, 1)", "rgba(230, 220, 200, 0.09)"]} style={styles.homeHeadgradient}>
                <TouchableOpacity style={styles.homeMonth} onPress={()=>showmonth(!month)} >
                    <Image style={styles.homeArrow} source={(require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowDown.png"))}/>
                    <Text>October</Text>
                </TouchableOpacity>
              <View style={{padding:10}}>
              <Text style={styles.username}>Account Balance</Text>
              <Text style={styles.heading}>$94500</Text>
              </View>
            <View style={styles.homeHeadView}>
                <TouchableOpacity style={[styles.headButton,{backgroundColor:'rgba(0, 168, 107, 1)'}]} onPress={()=>navigation.navigate("Income")}>
                    <Image source={(require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Income.png"))}/>
                   <View style={{padding:5}}>
                   <Text style={styles.homeTitle}>Income</Text>
                   <Text style={styles.budgetMonthtext}>$0.00</Text>
                   </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.headButton,{backgroundColor:'rgba(253, 60, 74, 1)'}]}  onPress={()=>navigation.navigate("Expense")}>
                <Image source={(require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Expense.png"))}/>
                 <View style={{padding:5}}>
                 <Text style={styles.homeTitle}>Expense</Text>
                 <Text style={styles.budgetMonthtext}>$0.00</Text>
                 </View>
                </TouchableOpacity>
            </View>
            </LinearGradient>
            {month&&(
                <View style={{position:'absolute',top:Platform.OS==="ios"?"10.5%":'9.5%',width:'100%'}}>
                    <Months/>
                </View>
            )}
            <View style={styles.linechart}>
                <Text>Spend Frequency</Text>
                <LineChart data={data}
width={Dimensions.get("window").width} // Dynamic width
height={220}
withDots={false}
withInnerLines={false}
withOuterLines={false}
withVerticalLabels={false}
withHorizontalLabels={false}
fromZero={true}
yAxisInterval={1}
chartConfig={{
backgroundGradientFrom: "white",
backgroundGradientFromOpacity: 0,
backgroundGradientTo: "white",
backgroundGradientToOpacity: 0.5,
color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
useShadowColorFromDataset: false // optional
}}
bezier
style={{
borderRadius: 16,
marginLeft:0,
marginRight:0,
paddingLeft:0,paddingRight:0
}}/>
            </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}