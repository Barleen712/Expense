import React,{useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import GradientButton from "../../Components/CustomButton";
import Input from "../../Components/CustomTextInput"
import { Checkbox } from "react-native-paper";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
import Header from "../../Components/Header";
type SignupProp = StackNavigationProp<StackParamList, 'SignUp'>;

interface Props {
  navigation: SignupProp;
}
export default function SignUp({ navigation }:Props) {
  const[name,setname]=useState("")
  const[email,setemail]=useState("")
  const[password,setpass]=useState("")
  const [isSelected,changeSelection]=useState(false)
  async function handleSignUp()
  {
    try{
     const user= await createUserWithEmailAndPassword(auth,email,password)
     navigation.replace("Login")

    }
    catch(error:any)
    {
      alert(error.message)
    }
    setname("")
    setemail("")
    setemail("")
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}>
        <Header title="Sign Up"  press={()=>navigation.goBack()}></Header>
        <View style={styles.input}>
          <Input title="Name" color="rgb(56, 88, 85)" css={styles.textinput} name={name} onchange={setname}  isPass={false}/>
          <Input title="Email" color="rgb(56, 88, 85)" css={styles.textinput} name={email} onchange={setemail}  isPass={false}/>
          <Input title="Password" color="rgb(56, 88, 85)" css={styles.textinput}  isPass={true} name={password} onchange={setpass}/>
        </View>
     <View style={{flexDirection:'row',margin:20}}>
     <View style={{borderWidth:Platform.OS ==="ios"?1:0}} >
       </View>
        <Text>
          By signing up, you agree to the{" "}
          <Text style={{ color: "rgb(57, 112, 109)" }}>Terms of Service and Privacy Policy</Text>
        </Text>
    
     </View>
        <GradientButton title="Sign Up" handles={handleSignUp}/>
        <Text style={styles.or}>Or with</Text>
        <TouchableOpacity style={styles.GoogleView}>
          <Image
            style={styles.Google}
            source={require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Google.png")}
          />
          <Text style={styles.textGoogle}>Sign Up with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.account}>
            Already have an account? <Text style={styles.span}>Login</Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  textinput: {
    width: 343,
    height: 56,
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 10,
    padding:5,
    alignItems: "center",
    justifyContent:'center'
  },
  input: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 20 : 30,
  },
  or: {
    color: "rgb(145, 145, 159)",
    margin: 10,
  },
  GoogleView: {
    flexDirection: "row",
    height: 56,
    width: 343,
    alignItems: "center",
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 60,
  },
  Google: {
    height: 40,
    width: 40,
  },
  account: {
    margin: 15,
  },
  span: {
    color: "rgb(57, 112, 109)",
    textDecorationLine: "underline",
  },
  textGoogle: {
    paddingLeft: 10,
  },
});
