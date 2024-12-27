import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const ADD_POST = gql`
  mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      imgUrl
    }
  }
`;

export default function AddPost() {
  const [input, setInput] = useState({
    content: "",
    tags: "",
    imgUrl: "",
  });

  const [addPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: ["Posts"],
  });

  const navigation = useNavigation();

  const onChange = (text, name) => {
    setInput({
      ...input,
      [name]: text,
    });
  };

  const handleSubmit = async () => {
    try {
      const tagsArray = input.tags.split(",").map((tag) => tag.trim());
      const newPost = { ...input, tags: tagsArray };
      await addPost({
        variables: newPost,
      });
      navigation.navigate("Home");
      setInput({
        content: "",
        tags: "",
        imgUrl: "",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

      {/* Content Input */}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        onChangeText={(text) => onChange(text, "content")}
        value={input.content}
        multiline
      />

      {/* Tags Input */}
      <TextInput
        style={styles.input}
        placeholder="Add tags (comma-separated)"
        onChangeText={(text) => onChange(text, "tags")}
        value={input.tags}
      />

      {/* Image URL Input */}
      <TextInput
        style={styles.input}
        placeholder="Paste image URL"
        onChangeText={(text) => onChange(text, "imgUrl")}
        value={input.imgUrl}
      />

      {/* Image Preview */}
      {input.imgUrl ? (
        <Image source={{ uri: input.imgUrl }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.imagePlaceholder}>
          Image preview will appear here
        </Text>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {!loading ? (
          <Text style={styles.buttonText}>Post</Text>
        ) : (
          <ActivityIndicator size="small" color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePlaceholder: {
    height: 200,
    textAlign: "center",
    lineHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#aaa",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1877F2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#90CAF9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
