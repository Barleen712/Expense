import React from "react";
import { View,Text,FlatList, Touchable, TouchableOpacity } from "react-native";
import styles from "../Screens/Stylesheet";
const Month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
export default function Months()
{
    return(
        <View style={{width:'100%',alignItems:'center',}}>
         <FlatList data={Month} style={{width:'50%',height:'50%',backgroundColor:'white',borderRadius:6,}}
         renderItem={({item})=>(
      <View>
              <TouchableOpacity style={styles.dropdownItems}>
                <Text>{item}</Text>
                </TouchableOpacity>
                 <View style={styles.Line}></View>
        </View>
         )}/>
        </View>
    )
}