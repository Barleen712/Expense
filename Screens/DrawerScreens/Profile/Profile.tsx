import React, { useEffect, useState } from "react";
import { View, Text,TouchableWithoutFeedback,TextInput, Image, TouchableOpacity, Modal, ImageBackground, Dimensions,Keyboard ,Platform,KeyboardAvoidingView,ScrollView} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Stylesheet";
import { StackNavigationProp } from "@react-navigation/stack";
import StackParamList from "../../../Navigation/StackList";
import { CustomButton } from "../../../Components/CustomButton";
import { auth } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { StringConstants } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { clearData } from "../../../Slice/IncomeSlice";
import { getUseNamerDocument } from "../../../Saga/BudgetSaga";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { updateUserDoc } from "../../FirestoreHandler";
type Profileprop = StackNavigationProp<StackParamList, "MainScreen">;

interface Props {
  navigation: Profileprop;
}
export default function Profile({ navigation }: Props) {
  const [username, setuser] = useState("");
  const [photo, setPhoto] = useState("");
  const [editProfile, seteditProfile] = useState(false);
  const [modalPhoto,setmodalPhoto]=useState("")
  const [modalUser,setModalUser]=useState("")
  const [id,setUserId]=useState("")
  const profilepics = [require("../../../assets/women3.jpg"),require("../../../assets/man1.jpg"), require("../../../assets/Women2.jpg"),
    require("../../../assets/man2.jpg"),require("../../../assets/women1.jpg")
  ];
  async function getData() {
    const user = await getUseNamerDocument();
    setuser(user?.Name);
    setModalUser(user?.Name)
    setPhoto({uri:user?.Photo});
    setmodalPhoto({uri:user?.Photo})
    setUserId(user?.ID)
    if (!user?.Photo) {
      setPhoto(profilepics[1]);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  function toggleModal() {
    setModalVisible(!modalVisible);
  }
  async function handleLogout() {
    try {
      toggleModal();
      dispatch(clearData());
      await signOut(auth);
    } catch (error) {
      alert("Their was some error");
    }
  }
  const widths = Dimensions.get("window");
  const { t } = useTranslation();
  function saveChanges()
  {
    setPhoto(modalPhoto)
    setuser(modalUser)
    seteditProfile(!editProfile)
    updateUserDoc(id,{
      User:modalUser,
    photo:modalPhoto
    })
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "rgba(246, 246, 246, 1)" }]}>
      <ImageBackground style={{ width: widths, height: 800 }} source={require("../../../assets/ProfileBack.png")}>
        <View style={styles.profile}>
          <View style={styles.userphoto}>
            <Image style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 3 }} source={photo} />
          </View>
          <View style={styles.details}>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.ForgotDes}>{username}</Text>
          </View>
          <View style={styles.icon}>
            <TouchableOpacity onPress={() => seteditProfile(true)}>
              <Image source={require("../../../assets/Button Icon.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.manageProfile}>
          <View style={styles.options}>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Account")}>
              <View style={styles.icons}>
                <Ionicons name="wallet" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Account)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Settings")}>
              <View style={styles.icons}>
                <Ionicons name="settings" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Settings)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={() => navigation.navigate("Export")}>
              <View style={styles.icons}>
                <Ionicons name="push-outline" color="rgb(42, 124, 118)" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.ExportData)}</Text>
            </TouchableOpacity>
            <View style={styles.Line}></View>
            <TouchableOpacity style={styles.optionView} onPress={toggleModal}>
              <View style={styles.logouticon}>
                <Ionicons name="log-out-outline" color="red" size={30} />
              </View>
              <Text style={styles.optionsText}>{t(StringConstants.Logout)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.logout}>{t("Logout")}?</Text>
              <Text style={styles.quesLogout}>{t("Are you sure you want to logout?")}</Text>
              <View style={styles.modalButton}>
                <View style={styles.modalY}>
                  <CustomButton title={t("Yes")} bg="rgb(42, 124, 118)" color="white" press={handleLogout} />
                </View>
                <View style={styles.modalN}>
                  <CustomButton
                    title={t("No")}
                    bg="rgba(220, 234, 233, 0.6)"
                    color="rgb(42, 124, 118)"
                    press={toggleModal}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={editProfile}
          onRequestClose={() => seteditProfile(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={{
                width: "90%",
                height: "80%",
                backgroundColor: "white",
                marginBottom: 70,
                borderRadius: 20,
                padding: 20,
              }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                          scrollEnabled={Platform.OS === "ios" ? false : true}
                          contentContainerStyle={{ flexGrow: 1 }}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={{height:"100%",width:"100%"}}
                        >
              <TouchableOpacity style={{position:"absolute",right:"3%"}} onPress={()=>seteditProfile(!editProfile)}>
              <MaterialIcons name="cancel" size={26} color="rgb(4, 73, 69)" />
              </TouchableOpacity>
              <View style={{alignItems:"center",justifyContent:"center",padding:20 }}>
                <Image style={{ width: 150, height: 150, borderRadius: 80, borderWidth: 3 }} source={modalPhoto}/>
              </View>
              <View style={{margin:10}}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly" }}>
    {profilepics.map((item, index) => (
      <TouchableOpacity key={index} style={{ marginBottom:5 }} onPress={()=>setmodalPhoto(profilepics[index])}>
        <Image
          style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, resizeMode: "contain" }}
          source={item}
        />
      </TouchableOpacity>
    ))}
  </View>
              </View>
              <TouchableOpacity style={{marginTop:20, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "rgb(4, 73, 69)", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                  Add Your Custom Profile Picture
                </Text>
              </TouchableOpacity>

              <View style={{marginTop:30,paddingLeft:10,justifyContent:"space-evenly"}}>
                <Text style={{fontFamily:"Inter",
                  fontSize:16,
                  color:"rgb(4, 73, 69)"
                }}>Username</Text>
                <TextInput placeholder={username} 
                 value={modalUser}
                 onChangeText={setModalUser}
                style={{fontFamily: "Inter",
                    fontWeight:"600",
                    //fontStyle:"italic",
                    fontSize: Platform.OS === "ios" ? 24 : 24,
                  color:" rgb(3, 73, 69)",
                  borderBottomColor:"rgb(4, 73, 69)",
                borderBottomWidth:2}}
                    placeholderTextColor="rgba(4, 73, 69, 0.38)"/>
              </View>
              <TouchableOpacity 
              onPress={saveChanges}style={{marginTop:30, alignItems: "center", justifyContent: "center"}}>
                <Text style={{ color: "rgb(4, 73, 69)", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
                  Save Changes  
                </Text>
              </TouchableOpacity>
              </ScrollView>
              </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}
