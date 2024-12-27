import { useContext, useState, useEffect } from "react";
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useMutation, useQuery } from "@apollo/client";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID) {
    getUserProfile(_id: $id) {
      _id
      name
      username
      email
      followingDetails {
        _id
        name
        username
      }
      followerDetails {
        _id
        name
        username
      }
    }
  }
`;

const SEARCH_USERS_BY_USERNAME = gql`
  query UserByUsername($username: String) {
    userByUsername(username: $username) {
      _id
      name
      username
    }
  }
`;

const FOLLOW_USER = gql`
  mutation Follow($followingId: ID) {
    follow(followingId: $followingId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export default function Profile() {
  const { setIsSignedIn } = useContext(AuthContext);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("following");

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
  });

  const { data: searchData, refetch: searchUsers } = useQuery(
    SEARCH_USERS_BY_USERNAME,
    {
      variables: { username: searchTerm },
      skip: !searchTerm,
      onCompleted: (data) => {
        if (data && data.userByUsername) {
          setSearchResults(data.userByUsername);
        } else {
          setSearchResults([]);
        }
      },
    }
  );

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }
    searchUsers();
  };

  const [followUser] = useMutation(FOLLOW_USER, {
    onCompleted: () => refetch(),
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  const handleFollow = async (followingId) => {
    try {
      await followUser({ variables: { followingId } });
      alert("Action completed!");
    } catch (err) {
      alert("Error following user: " + err.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { getUserProfile } = data;

  return (
    <KeyboardAwareFlatList
      style={{ backgroundColor: "white" }}
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Profile Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri: `https://avatar.iran.liara.run/public?username=${getUserProfile.username}`,
              }}
              style={styles.coverPhoto}
            />
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: `https://avatar.iran.liara.run/public?username=${getUserProfile.username}`,
                }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{getUserProfile.name}</Text>
              <Text style={styles.username}>@{getUserProfile.username}</Text>
              <Text style={styles.email}>{getUserProfile.email}</Text>

              {/* Logout Button */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search user..."
              value={searchTerm}
              onChangeText={(text) => handleSearch(text)}
            />
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <View style={styles.userListItem}>
                  <Image
                    source={{
                      uri: `https://avatar.iran.liara.run/public?username=${item.username}`,
                    }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userHandle}>@{item.username}</Text>
                    <Button
                      title="Follow"
                      onPress={() => handleFollow(item._id)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item._id}
            />
          )}

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statBox}>
              <Text style={styles.statCount}>
                {getUserProfile.followingDetails.length}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statBox}>
              <Text style={styles.statCount}>
                {getUserProfile.followerDetails.length}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "following" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("following")}
            >
              <Text>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "followers" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("followers")}
            >
              <Text>Followers</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      data={
        activeTab === "following"
          ? getUserProfile.followingDetails
          : getUserProfile.followerDetails
      }
      renderItem={({ item }) => (
        <View style={styles.userListItem}>
          <Image
            source={{
              uri: `https://avatar.iran.liara.run/public?username=${item.username}`,
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userHandle}>@{item.username}</Text>
          </View>
          {activeTab === "following" && (
            <TouchableOpacity
              style={styles.unfollowButton}
              onPress={() => handleFollow(item._id)}
            >
              <Text style={styles.unfollowButtonText}>Unfollow</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={() => (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            {activeTab === "following"
              ? "You are not following anyone yet."
              : "You don't have any followers yet."}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 200,
    marginBottom: 120,
  },
  coverPhoto: {
    width: "100%",
    height: 120,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: "#666",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  statBox: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1877F2",
  },
  userListItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 15,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4d4f",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  emptyListContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  unfollowButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 15,
    marginLeft: "auto",
  },
  unfollowButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
