import React, { useState } from "react";
import { View,FlatList,TouchableOpacity,Text,Image } from "react-native";
import styles from "../Screens/Stylesheet";
interface dropdown
{
    data:Array<string>,
    open:boolean
    setopen:()=>void
    name:string
}

export default function DropDown({data,open,setopen,name}:dropdown)
{
    const [selected,setselected]=useState<number|null>(null)
    return(
        <View style={styles.dropdown}>
            <TouchableOpacity onPress={setopen} style={styles.dropdownView}>
            <Text style={styles.categoryText}>{selected !== null ? data[selected] : name}</Text>
            <Image style={styles.arrowDown}source={(require('/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowDown.png'))}/>
            </TouchableOpacity>
            {
                open &&
                (
                    <View style={styles.dropdown}>
                        <FlatList style={styles.itemView}data={data} 
                        renderItem={({item,index})=>
                        (
                           <View >
                             <TouchableOpacity style={styles.dropdownItems} onPress={()=>{setselected(index)
                                setopen()
                             }}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                            <View style={styles.Line}></View>
                            </View>
                        )}/>
                        </View>
                )
            }
        </View>
    )
}