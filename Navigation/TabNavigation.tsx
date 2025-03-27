import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/DrawerScreens/Home";
import Transaction from "../Screens/DrawerScreens/Transaction";
import Budget from "../Screens/DrawerScreens/Budget/Budget";
import Profile from "../Screens/DrawerScreens/Profile/Profile";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
export default function Tabscreens() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cash" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
