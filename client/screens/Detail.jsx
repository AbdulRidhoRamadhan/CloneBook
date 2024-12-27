import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import CommentInput from "../components/CommentInput";
import CommentBar from "../components/CommentBar";
import PostCard from "../components/PostCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const GET_POST_BY_ID = gql`
  query PostById($id: ID) {
    postById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function Detail({ route }) {
  const { loading, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: route.params._id,
    },
  });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1877F2" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
      <PostCard post={data.postById} refetch={refetch} />

      <View
        style={{
          gap: 8,
          marginTop: 8,
          marginBottom: 18,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            borderBottomColor: "#f5f5f5",
            borderBottomWidth: 1,
            paddingBottom: 4,
          }}
        >
          Comments ({data.postById.comments?.length || 0})
        </Text>
        <CommentInput
          postId={route.params._id}
          refetch={refetch}
          showKeyboard={route.params.showKeyboard}
        />
      </View>

      <SafeAreaView style={styles.container}>
        <View style={{ gap: 10, paddingHorizontal: 16 }}>
          {data.postById.comments.map((item) => (
            <CommentBar comment={item} refetch={refetch} />
          ))}
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
