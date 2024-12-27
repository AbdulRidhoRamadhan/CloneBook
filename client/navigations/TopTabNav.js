import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AddPost from "../screens/AddPost";
import Ionicons from "@expo/vector-icons/Ionicons";

const TopTabNav = createMaterialTopTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "Home") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name === "Profile") {
        iconName = focused ? "menu" : "menu-outline";
      } else if (route.name === "AddPost") {
        iconName = focused ? "add-circle" : "add-circle-outline";
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarLabel: () => null,
    tabBarActiveTintColor: "#4267B2",
    tabBarInactiveTintColor: "#4267B2",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  }),
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Home",
      },
    },
    AddPost: {
      screen: AddPost,
      options: {
        title: "Add Post",
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: "Profile",
      },
    },
  },
});

export default TopTabNav;
