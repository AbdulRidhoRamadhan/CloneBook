import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "../screens/Detail";
import { Text } from "react-native";
import Login from "../screens/Login";
import TopTabNav from "./TopTabNav";
import AddPost from "../screens/AddPost";
import Register from "../screens/Register";
import { useIsSignedIn, useIsSignedOut } from "../context/AuthContext";

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: "white",
    },
    headerTintColor: "#4267B2",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: {
          screen: TopTabNav,
          options: {
            title: "CloneBook",
          },
        },
        Detail: {
          screen: Detail,
          options: ({ route }) => ({
            title: route.params.title,
          }),
        },
        AddPost: {
          screen: AddPost,
          options: {
            title: "Add Post",
          },
        },
      },
    },
    SIgnedOut: {
      if: useIsSignedOut,
      screens: {
        Login: {
          screen: Login,
          options: {
            headerShown: false,
          },
        },
        Register: {
          screen: Register,
          options: {
            headerShown: false,
          },
        },
      },
    },
  },
});

export default RootStack;
