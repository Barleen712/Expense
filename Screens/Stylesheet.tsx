import { Platform, StyleSheet } from "react-native";
import Budget from "./DrawerScreens/Budget/Budget";
const styles = StyleSheet.create({
  setup: {
    flex: 0.2,

    alignItems: "center",
    justifyContent: "center",
  },
  keypad: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.4,
  },
  pin: {
    flexDirection: "row",
    flex: 0.4,
    height: "100%",
  },
  setuptext: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 18,
    color: "white",
  },
  keypad1: {
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },
  number: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 53,
    color: "white",
  },
  arrow: {
    position: "absolute",
    height: 40,
    width: 50,
    resizeMode: "contain",
    bottom: Platform.OS === "ios" ? 20 : 35,
    right: 35,
  },
  dot: {
    width: "10%",
    height: Platform.OS === "ios" ? "14%" : "13%",
    borderRadius: 40,
    margin: 5,
    borderWidth: 3,
    borderColor: "white",
  },
  filledDot: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headView: {
    flex: 0.2,
    height: "100%",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  desAccount: {
    flex: 0.15,
    height: "100%",

    padding: 20,
  },
  letsgo: { flex: 0.65, height: "100%", alignItems: "center" },
  heading: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: Platform.OS === "ios" ? 33 : 35,
    color: "black",
  },
  destext: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 14 : 16,
    color: "black",
    width: "80%",
  },
  gobutton: {
    position: "absolute",
    bottom: "15%",
    width: "100%",
    alignItems: "center",
  },
  textinput: {
    width: "90%",
    height: 56,
    color: "black",
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 20,
    padding: 15,
  },
  ForgotTitle: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 30,
  },
  email: {
    flex: 7,
    alignItems: "center",
  },
  ForgotDes: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 24 : 28,
    color: "black",
  },
  emailImgView: {
    flex: 0.45,
    alignItems: "center",
    justifyContent: "center",
  },
  emailDes: {
    flex: 0.55,
    alignItems: "center",
  },
  emailImg: {
    height: "80%",
    width: "80%",
    resizeMode: "contain",
  },
  emailDesText: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 16 : 18,
    color: "black",
    padding: 30,
    textAlign: "center",
  },
  backToLogin: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
  add: {
    flex: 1,
    backgroundColor: "rgb(56, 88, 85)",
    justifyContent: "flex-end",
  },
  selection: {
    backgroundColor: "white",
    borderTopStartRadius: "10%",
    borderTopRightRadius: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 40,
    paddingTop: 15,
  },
  selectinput: {
    width: "100%",
    marginLeft: 20,
  },
  textinput1: {
    width: "90%",
    height: 56,
    color: "black",
    borderRadius: 16,
    borderColor: "rgba(133, 126, 126, 0.89)",
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  amount: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 60 : 64,
    color: "white",
  },
  balance: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 16 : 18,
    color: "rgba(220, 234, 233, 0.6)",
  },
  balanceView: {
    margin: 15,
  },
  success: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  profile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    margin: 20,
  },
  userphoto: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  icon: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 14 : 16,
    color: "rgba(145, 145, 159, 1)",
  },
  manageProfile: {
    justifyContent: "center",
    alignItems: "center",
  },
  options: {
    backgroundColor: "white",
    borderRadius: "5%",
    width: "80%",
    marginTop: Platform.OS === "ios" ? 10 : 29,
  },
  optionView: {
    flexDirection: "row",
    alignItems: "center",
    height: Platform.OS === "ios" ? 80 : 89,
    paddingLeft: 20,
  },
  icons: {
    padding: 5,
    marginRight: 5,
    flex: 0.12,
    backgroundColor: "rgba(220, 234, 233, 0.6)",
    borderRadius: 10,
  },
  logouticon: {
    padding: 5,
    flex: 0.12,
    marginRight: 5,
    backgroundColor: " rgba(255, 226, 228, 1)",
    borderRadius: 10,
  },
  Line: {
    width: "100%",
    height: 1,
    backgroundColor: 'color="rgba(56, 88, 85, 0.11)',
  },
  optionsText: {
    flex: 0.88,
    paddingLeft: 10,
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 16 : 18,
    fontWeight: "bold",
  },
  settingsOptions: {
    flexDirection: "row",
    height: "20%",
    alignItems: "center",
  },
  settings: {
    flex: 0.5,
    margin: Platform.OS === "ios" ? 20 : 15,
  },
  settingtitle: {
    flex: 0.8,
    alignItems: "center",
    fontSize: Platform.OS === "ios" ? 16 : 18,
  },
  titleoption: {
    flex: 0.15,
    justifyContent: "center",
  },
  arrows: {
    flex: 0.05,
    justifyContent: "center",
  },
  settingtext: {
    color: "grey",
  },
  accountbg: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    width: "100%",
    height: "100%",
  },
  accbalance: {
    position: "absolute",
    top: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  accamount: {
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: Platform.OS === "ios" ? 40 : 44,
  },
  accbutton: {
    flex: 0.15,
    alignItems: "center",
    // justifyContent:'center',
  },
  accTitle: {
    color: "rgba(145, 145, 159, 1)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    height: Platform.OS === "ios" ? "25%" : "28%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  modalButton: {
    flexDirection: "row-reverse",
    width: "100%",
    height: "50%",
    padding: 20,
  },
  modalY: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalN: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 18 : 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  quesLogout: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    marginTop: Platform.OS === "ios" ? 18 : 20,
    color: "grey",
  },
  export: {
    width: "100%",
    margin: 10,
    marginTop: 30,
  },
  exportText: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    padding: 10,
    fontWeight: Platform.OS === "ios" ? 500 : "bold",
  },
  exportButton: {
    alignItems: "center",
    position: "absolute",
    bottom: "5%",
    width: "100%",
    justifyContent: "center",
  },
  exportimg: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  export1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  Export1text: {
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    fontWeight: Platform.OS === "ios" ? 500 : "bold",
  },
  items: {
    flexDirection: "row",
    padding: 15,
  },
  itemTitle: {
    flex: 0.8,
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    // fontWeight: Platform.OS === "ios" ? 500 : "bold",
  },
  itemSelected: {
    flex: 0.2,
    alignItems: "flex-end",
  },
  notiView: {
    flexDirection: "row",
    width: "100%",

    padding: 10,
  },
  noti: {
    width: "85%",
  },
  switch: {
    transform: Platform.OS === "ios" ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  notiTitle: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 18 : 20,
    fontWeight: Platform.OS === "ios" ? 500 : "bold",
  },
  notiDes: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    color: "grey",
    width: "65%",
  },
  headerContainer: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    padding: 10,
  },
  headerText: {
    fontSize: Platform.OS === "ios" ? 18 : 20,
    flex: 0.9,
    fontWeight: Platform.OS === "ios" ? 400 : 500,

    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  budgetView: {
    backgroundColor: "white",
    borderTopStartRadius: "5%",
    borderTopRightRadius: "5%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "80%",
  },
  budgetButton: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    alignItems: "center",
  },
  budgetText: {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    color: "grey",
  },
  budgetMonth: {
    flexDirection: "row",
    marginBottom: 40,
    justifyContent: "space-between",
    margin: 20,
  },
  budgetMonthtext: {
    fontFamily: "Inter",
    fontWeight: Platform.OS === "ios" ? 500 : 600,
    fontSize: Platform.OS === "ios" ? 24 : 28,
    color: "white",
  },
  dropdownView:
  {
    width:"90%",
    borderRadius:15,
    borderWidth:0.5,
    borderColor:'grey',
    height:56,
    justifyContent:'center',
    padding:10,
    marginBottom:10
  },
  dropdownItems:
  {
     justifyContent:'center',
     padding:10,
     height:56
  },
  itemView:
  {
    height:200,
    width:"90%",
  
  },
  dropdown:
  {
    width:"100%",alignItems:'center'
  },
  arrowDown:
  {
    position:'absolute',
    right:'5%'
  },
  categoryText:
  {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    
  },
  container1: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width:'90%'
  },
  sliderWrapper: {
    position: 'relative',
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },trackBackground: {
    position: 'absolute',
    height: 15,
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 10,
  },
  trackFill: {
    position: 'absolute',
    height: 15 ,
    backgroundColor: 'rgb(42, 124, 118)',
    borderRadius: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  customThumb: {
    position: 'absolute',
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgb(42, 124, 118)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth:1.5,
    borderColor:'white'
  },
  thumbText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  homeHeadgradient:
  {
    flex:0.3,borderBottomLeftRadius:15,borderBottomRightRadius:15,alignItems:'center'
  },
  homeHeadView:
  {
    width:'88%',
    flexDirection:"row",justifyContent:"space-between",
    height:'35%'
  },headButton:
  {
    flexDirection:"row",
    alignItems:'center',
    padding:10,
    borderRadius:25,
    width:'45%'
  
  },
  homeTitle:
  {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    color: "white",
  },
  homeMonth:
  {
    borderRadius:20,
    borderWidth:0.3,
    borderColor:'grey',
    padding:5,
    marginTop:5,
    flexDirection:'row',
    width:'25%'
  },homeArrow:
  {
    width:20,
    height:20,
    resizeMode:'contain'
  },
  homeamount:
  {
    fontFamily: "Inter",
    fontSize: Platform.OS === "ios" ? 18: 20,
  },
  linechart:
  {
    flex:0.3
  },
  attachment:
  {
    width:'90%',
    borderWidth:0.8,
    height:56,
    borderColor:'grey',
    borderStyle:"dashed",
    borderRadius:16,
  }
});
export default styles;
