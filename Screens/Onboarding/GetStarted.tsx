import React,{useState} from "react";
import Carousel from 'react-native-reanimated-carousel';
import { View, Text, Image, Dimensions, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { CustomButton } from "../../Components/CustomButton";
const { width: screenWidth } = Dimensions.get("window");
import { StackNavigationProp } from '@react-navigation/stack';
import StackParamList from "../../Navigation/StackList";
type GetstartedNavigationProp = StackNavigationProp<StackParamList, 'GetStarted'>;

interface Props {
  navigation: GetstartedNavigationProp;
}
interface CarouselItem {
  id: string;
  image: any; 
  title: string;
  des: string;
}
export default function Getstarted({navigation}:Props) {
  function signup()
  {
    navigation.navigate("SignUp")
  }
  function login()
  {
    navigation.navigate("Login")
  }
    const [activeIndex, setActiveIndex] = useState(0);
  const data = [
    {
      id: "1",
      image: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Control.png"),
      title: "Gain total control of your money",
      des: "Become your own money manager and make every cent count",
    },
    {
      id: "2",
      image: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Know.png"),
      title: "Know where your money goes",
      des: "Track your transaction easily,with categories and financial report ",
    },
    {
      id: "3",
      image: require("/Users/chicmic/Desktop/Project/ExpenseTracker/assets/Plan.png"),
      title: "Planning activities in budget",
      des: "Setup your budget for each category so you in control",
    },
  ];
  const render = ({ item }:{item:CarouselItem}) => {
    return (
      <View style={styles.view}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.des}>{item.des}</Text>
      </View>
    );
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{alignItems:'center',backgroundColor:'white',flex:1}}>
        <Carousel
          data={data}
          renderItem={render}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
          width={screenWidth}
          height={Platform.OS === "ios" ? 400 : 500}
          onSnapToItem={(index) => setActiveIndex(index)}
        ></Carousel>
          <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <CustomButton title="Sign Up" bg="rgb(42, 124, 118)" color="white" press={signup}/>
        <CustomButton title="Login" bg="rgba(220, 234, 233, 0.6)" color="rgb(42, 124, 118)" press={login}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    height: Platform.OS === "ios" ? 220 : 300,
    width: Platform.OS === "ios" ? 200 : 280,
  },
  title: {
    paddingTop: 30,
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: Platform.OS === "ios" ? 32 : 37,
    textAlign: "center",
  },
  des:{
    paddingTop:10,
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: Platform.OS === "ios" ? 16 : 19,
    textAlign: "center",
    color:' rgba(145, 145, 159, 1)'
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin:15
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: "#C1C1C1", 
  },
  activeDot: {
    backgroundColor: "rgb(42, 124, 118) ", 
    width: Platform.OS === "ios" ? 15 : 14,
    height: Platform.OS === "ios" ? 15 : 14,
    borderRadius: 10,
  },
});
