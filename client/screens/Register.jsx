import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const REGISTER = gql`
  mutation AddUser(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    addUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      name
      username
      email
      password
    }
  }
`;

export default function Register() {
  const [register, { loading }] = useMutation(REGISTER);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const result = await register({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
        },
      });
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Error", error.message);
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CloneBook</Text>
      <Text style={styles.subtitle}>It’s quick and easy.</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={setName}
          value={name}
          placeholder="Full Name"
          style={styles.input}
        />
      </View>
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
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="#1877F2" />
      )}

      <Text style={styles.altText}>
        Already have an account?{" "}
        <Text
          style={styles.altLink}
          onPress={() => navigation.navigate("Login")}
        >
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#1877F2",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#555",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 8,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  altText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#555",
  },
  altLink: {
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
