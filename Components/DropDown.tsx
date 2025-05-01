// import React, { useState } from "react";
// import { View,FlatList,TouchableOpacity,Text,Image } from "react-native";
// import styles from "../Screens/Stylesheet";
// interface dropdown
// {
//     data:Array<string>,
//     open:boolean
//     setopen:()=>void
//     name:string
// }

// export default function DropDown({data,open,setopen,name}:dropdown)
// {
//     const [selected,setselected]=useState<number|null>(null)
//     return(
//         <View style={styles.dropdown}>
//             <TouchableOpacity onPress={setopen} style={styles.dropdownView}>
//             <Text style={styles.categoryText}>{selected !== null ? data[selected] : name}</Text>
//             <Image style={styles.arrowDown}source={(require('/Users/chicmic/Desktop/Project/ExpenseTracker/assets/arrowDown.png'))}/>
//             </TouchableOpacity>
//             {
//                 open &&
//                 (
//                     <View style={styles.dropdown}>
//                         <FlatList style={styles.itemView}data={data}
//                         renderItem={({item,index})=>
//                         (
//                            <View >
//                              <TouchableOpacity style={styles.dropdownItems} onPress={()=>{setselected(index)
//                                 setopen()
//                              }}>
//                                 <Text style={styles.categoryText}>{item}</Text>
//                             </TouchableOpacity>
//                             <View style={styles.Line}></View>
//                             </View>
//                         )}/>
//                         </View>
//                 )
//             }
//         </View>
//     )
// }
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import styles from "../Screens/Stylesheet";
interface DropdownItem {
  label: string;
  value: string;
}
interface dropdown {
  value: string;
  data: DropdownItem[];
  name: string;
  styleButton: object;
  styleItem?: object;
  onSelectItem: (selectedItem: string) => void;
}

const DropdownComponent = ({ name, data, styleButton, value, styleItem, onSelectItem }: dropdown) => {
  return (
    <Dropdown
      style={styleButton}
      data={data}
      maxHeight={300}
      containerStyle={styleItem}
      labelField="label"
      valueField="value"
      value={value}
      placeholder={name}
      onChange={(selectedItem) => {
        onSelectItem(selectedItem.value);
      }}
    />
  );
};

export default DropdownComponent;

// const styles = StyleSheet.create({
//   dropdown: {
//     margin: 16,
//     height: 50,
//     borderBottomColor: "gray",
//     borderBottomWidth: 0.5,
//     width: "100%",
//   },
//   icon: {
//     marginRight: 5,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
// });
