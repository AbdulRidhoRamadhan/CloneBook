import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
      message
      userId
    }
  }
`;

export default function Login() {
  const [login, { loading }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await login({
        variables: {
          username: username,
          password: password,
        },
      });
      await SecureStore.setItemAsync(
        "access_token",
        result.data.login.access_token
      );
      await SecureStore.setItemAsync("user_id", result.data.login.userId);
      setIsSignedIn(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Login Error", error.message);
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>CloneBook</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            style={styles.input}
            secureTextEntry={secureEntry}
          />
          <TouchableOpacity
            style={styles.eyeIconButton}
            onPress={() => setSecureEntry(!secureEntry)}
          >
            <Feather
              name={secureEntry ? "eye-off" : "eye"}
              size={20}
              color="#1877F2"
            />
          </TouchableOpacity>
        </View>
        {!loading ? (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator size="large" color="#1877F2" />
        )}
        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#1877F2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: "#1877F2",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 8,
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  signupLink: {
    color: "#1877F2",
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  eyeIconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
