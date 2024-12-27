import { gql, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PostCard from "../components/PostCard";

const GET_POSTS = gql`
  query Posts {
    posts {
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

export default function Home() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  const navigation = useNavigation();

  const handleAddPost = () => {
    navigation.navigate("AddPost");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877F2" />
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <TouchableOpacity style={styles.addPostCard} onPress={handleAddPost}>
      <Image
        source={{
          uri: `https://avatar.iran.liara.run/username?username=?&background=dfe3ee&color=000`,
        }}
        style={styles.profileImage}
      />
      <Text style={styles.placeholderText}>What's on your mind?</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        style={styles.container}
        data={data.posts}
        renderItem={({ item }) => (
          <PostCard post={item} refetch={refetch} isCardHome />
        )}
        keyExtractor={(item, idx) => idx}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addPostCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
});
