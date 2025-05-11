import React ,{useContext}from "react"
import {ScrollView,View,Text,Image,Dimensions} from "react-native"
import { ThemeContext } from "../../../../../Context/ThemeContext"
import getStyles from "./styles"
import Header from "../../../../../Components/Header"
import Carousel from "react-native-reanimated-carousel";
const width=Dimensions.get("screen").width*0.9
const height=Dimensions.get("screen").height*0.5
const carousel_data=[{
    id:"1",
    title:"Seamless Expense Tracking",
    image:require("../../../../../assets/instant.png"),
    des:"Log daily expenses , incomes and transfers effortlessly"
},
{
    id:"2",
    image:require("../../../../../assets/instant.png"),
    title:"Custom Budget",
    des:"Set, monitor, and adjust budgets across various categories"
},
{
    id:"3",
    title:"Real-Time Insights",
    image:require("../../../../../assets/instant.png"),
    des:"Visual reports and analytics to help you understand your spending patterns"
},
{
    id:"4",
    title:"Secure & Private",
    image:require("../../../../../assets/encrption.png"),
    des:"Your financial data is encrypted and protected at all times"
},
{
    id:"5",
    image:require("../../../../../assets/instant.png"),
    title:"Multi-Device Access",
    des:"Manage your finances anytime, anywhere"
}
]
export default function AboutUs({navigation})
{
    const {colors}=useContext(ThemeContext)
    const styles=getStyles(colors)
    const render=({item})=>
  {
    return(
        
            <View style={styles.carouselItem}>
                <Text style={{fontSize:26,fontWeight:"bold"}}>{item.title}</Text>
                <Image style={{height:"50%",width:"50%"}}source={item.image}></Image>
                <Text style={{fontSize:16,textAlign:"center",fontWeight:"bold",}}>{item.des}</Text>
            </View>
        
    )
  }
    return(
        <View style={styles.container}>
           <Header title="About" press={() => navigation.goBack()} bgcolor={colors.backgroundColor}color={colors.color} />
          <ScrollView 
          contentContainerStyle={{paddingBottom:30}}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <View style={styles.headView}>
          <Text style={{color:colors.color}}>
                Welcome to <Text style={styles.span}>Montra </Text>- your smart solution for managing personal finances with ease. {"\n\n"}
                At Montra , our mission is simple : <Text style={styles.span}>to help you gain control over your money and achieve finacial wellness.</Text>
                We understand that managing expenses, tracking spending habits, and planning budgets can be overwhelming, especially in a fast-paced world. That's why we've built a user-friendly,
                intuitive expense tracker that empowers you to take charge of your financial life. 
            </Text>
          </View>
          <View style={styles.carousel}>
            <Text style={styles.offer}>What We Offer</Text>
            <Carousel
          data={carousel_data}
          renderItem={render}
          loop={true}
          autoPlay={true}
          autoPlayInterval={3000}
          width={width}
          style={{height:height, alignItems:"center"}}
        //  style={{ flex: 0.95 }}
       //   onSnapToItem={(index) => setActiveIndex(index)}
        ></Carousel>
          </View>
          <View style={{marginTop:20}}>
          <Text style={styles.offer}>Our Vision</Text>
          <Text style={{color:colors.color}}>We believe financial awareness is the first step to financial freedom. Our goal is to make budgeting and expense tracking
            accessible and effective for everyone - whether you're a student, a working professional, or managing a household.
          </Text>
          </View>
          <View style={{marginTop:20}}>
          <Text style={styles.offer}>Get in Touch</Text>
          <Text style={{color:colors.color}}>Have questions, feedback, or suggestion?{"\n"}
            We'd love to hear from you!{'\n'}
            Email us at: support@montra.com {"\n\n"}
            Let Montra be your financial companion <Text style={styles.span}>-one transaction at a time</Text>
          </Text>
          </View>
          </ScrollView>
        </View>
    )
}