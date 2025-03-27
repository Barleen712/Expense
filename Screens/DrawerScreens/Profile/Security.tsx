
import React ,{useState}from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, FlatList} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import styles from "../../Stylesheet";
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../../Navigation/StackList";
import Header from "../../../Components/Header";
type SecurityProp = StackNavigationProp<StackParamList, 'Account'>;

interface Props {
  navigation: SecurityProp;
}
export default function Security({navigation}:Props)
{

const currencies=["PIN","Fingerprint","Face ID"]
    const [selected,setSelected]=useState('PIN')
    return(
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                 <Header title="Security" press={()=>navigation.goBack()}/>
                      <View style={styles.Line}></View>
            <FlatList style={styles.settings} data={currencies}
        renderItem={({item})=>
        (
            <View>
                <TouchableOpacity onPress={()=>setSelected(item)} style={styles.items}>
            <Text style={styles.itemTitle}>{item}</Text>
            {selected===item&&
            (
                <View style={styles.itemSelected}>
                    <Ionicons name="checkmark-circle" size={20} color="green"></Ionicons>
                </View>
            )}
            </TouchableOpacity>
            <View style={styles.Line}></View>
            </View>
            

        )
        }/>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}