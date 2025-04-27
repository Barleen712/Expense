import react, { useState } from "react"
import { Modal,View ,Text} from "react-native"
import styles from "../Screens/Stylesheet"
import CustomD from "./Practice"
import { useTranslation } from "react-i18next"
import { StringConstants } from "../Screens/Constants"
import { CustomButton } from "./CustomButton"
const Frequency=["Yearly","Monthly","Weekly","Daily"]
const Month=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]
const date=[]
for(let i=1;i<=31;i++)
{
  date.push(i)
}
export default function FrequencyModal({frequency,setFrequency})
{
    const [modalVisible,setModalVisible]=useState(true)
    function toggleModal()
    {
        setModalVisible(!modalVisible)
    }
    const {t}=useTranslation()
    const [selected,setselected]=useState(false)
    const [month,setMonth]=useState(Month[0])
  
    return(
              <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
                  <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer,{height:"35%"}]}>
                    <View style={{width:'100%',alignItems:"center",flexDirection:"row",justifyContent:"space-evenly"}}>
                      <View style={{width:selected?"30%":"100%",alignItems:"center"}}>
                      <CustomD
                                       name={"Frequency"}
                                       data={Frequency}
                                       styleButton={styles.textinput}
                                       styleItem={styles.dropdownItems}
                                       styleArrow={styles.arrowDown}
                                     onSelectItem={(item) => {setFrequency(item)
                                      setselected(true)}
                                     }
                                     />
                      </View>
                                     {selected &&(
                                      <View style={{width:"30%",flexDirection:"row"}}>
                                        <CustomD
                                      name={Month[0]}
                                      data={Frequency}
                                      styleButton={styles.textinput}
                                      styleItem={styles.dropdownItems}
                                      styleArrow={styles.arrowDown}
                                    onSelectItem={(item) => {setMonth(item)
                                     setselected(true)}
                                    }
                                    />
                                        </View>
                                    
                                     )

                                     }
                                     {selected &&(
                                      <View style={{width:"30%",flexDirection:"row"}}>
                                        <CustomD
                                      name={date[0]}
                                      data={date}
                                      styleButton={styles.textinput}
                                      styleItem={styles.dropdownItems}
                                      styleArrow={styles.arrowDown}
                                    onSelectItem={(item) => {setFrequency(item)
                                     setselected(true)}
                                    }
                                    />
                                        </View>
                                    
                                     )

                                     }
                    </View>
                                     <CustomD
                                       name={"End After"}
                                       data={Frequency}
                                       styleButton={styles.textinput}
                                       styleItem={styles.dropdownItems}
                                       styleArrow={styles.arrowDown}
                                     //  onSelectItem={(item) => setSelectedCategory(item)}
                                     />
                                     <CustomButton
                                                       title={t(StringConstants.Continue)}
                                                       bg="rgba(0, 168, 107, 1)"
                                                       color="white"
                                                      // press={parameters.edit ? editIncome : add}
                                                     />
                    </View>
                  </View>
                </Modal>

    )
}