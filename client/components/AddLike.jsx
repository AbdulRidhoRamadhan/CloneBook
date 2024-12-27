import { gql, useMutation } from "@apollo/client";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ADD_LIKE = gql`
  mutation PostLike($id: ID) {
    postLike(_id: $id) {
      username
      createdAt
      updatedAt
    }
  }
`;

export default function AddLike({
  postId,
  refetch,
  currentLikes,
  setCurrentLikes,
}) {
  const [addLike, { loading }] = useMutation(ADD_LIKE, {
    onCompleted: () => {
      setCurrentLikes(currentLikes + 1);
      refetch();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleLike = async () => {
    try {
      await addLike({
        variables: {
          id: postId,
        },
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLike}
      style={styles.actionButton}
      disabled={loading}
    >
      <AntDesign name="like2" size={20} color="gray" />
      <Text style={styles.actionText}>{loading ? "Liking..." : "Like"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#555",
  },
});
