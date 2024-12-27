import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation PostComment($content: String, $postId: ID) {
    postComment(content: $content, postId: $postId) {
      username
      updatedAt
      createdAt
      content
    }
  }
`;

export default function CommentInput({ postId, refetch, showKeyboard }) {
  const [comment, setComment] = useState("");
  const [addComment, { data, loading, error }] = useMutation(ADD_COMMENT);

  const handleSubmit = async () => {
    console.log(comment);
    try {
      const result = await addComment({
        variables: {
          content: comment,
          postId: postId,
        },
      });
      console.log(result);
      await refetch();
      setComment("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        paddingVertical: 8,
        backgroundColor: "white",
      }}
    >
      <TextInput
        style={styles.input}
        onChangeText={setComment}
        value={comment}
        placeholder="comment here"
        autoFocus={showKeyboard}
      />
      <TouchableHighlight
        onPress={handleSubmit}
        style={{ justifyContent: "center" }}
      >
        <Feather name="send" size={24} color="black" />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
});
