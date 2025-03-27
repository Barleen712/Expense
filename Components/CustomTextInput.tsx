import React, { useState } from "react"
import {TextInput,View,StyleSheet,TouchableOpacity} from"react-native"
import { Ionicons } from '@expo/vector-icons';
interface InputProps {
  title: string;
  color: string;
  css: object;
  isPass?: boolean;
  name?: string;
  onchange?: (text: string) => void;
}
export default function Input({title,color,css,isPass,name,onchange}:InputProps)
{  
    const icon=isPass
    function handlesvisible()
    {
       setVisible(prev=>!prev)
    }
    const [Visible,setVisible]=useState(isPass)
    return(
     <View style={{width:'100%'}}>
           <TextInput placeholder={title}placeholderTextColor={color} style={css} secureTextEntry={Visible} value={name} onChangeText={onchange}/>
           {icon && ( 
        <TouchableOpacity  style={styles.icon} onPress={handlesvisible}>
          <Ionicons
            name={Visible?"eye-off":"eye"}
            size={25}
            color="gray"
          />
        </TouchableOpacity>
      )}
     </View>
    )
}
const styles=StyleSheet.create({
    icon: {
    position: "absolute",
    right:"10%",
    top:"35%"
  },
})