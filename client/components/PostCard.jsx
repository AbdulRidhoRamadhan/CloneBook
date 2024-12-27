import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  Share,
} from "react-native";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { format } from "date-fns";
import AddLike from "./AddLike";
import { useState } from "react";

export default function PostCard({ post, refetch, isCardHome }) {
  const navigation = useNavigation();
  const [currentLikes, setCurrentLikes] = useState(post.likes.length);

  const formatCreatedAt = (date) => {
    if (!date) {
      return "Invalid date";
    }

    const createdAt = new Date(date);
    if (isNaN(createdAt)) {
      return "Invalid date";
    }

    const now = new Date();
    const diffInMs = now - createdAt;
    const secondsDiff = Math.floor(diffInMs / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);

    if (secondsDiff < 60) {
      return "Just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minutes ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hours ago`;
    } else {
      return format(createdAt, "MMMM dd, yyyy");
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Saya buat postingan ini: ${post.content}, cek dan like!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{
            uri: `https://avatar.iran.liara.run/public?username=${post.author.username}`,
          }}
        />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.postTime}>
            {formatCreatedAt(post.createdAt)} •
            <FontAwesome name="globe" size={15} color="gray" />
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color="gray"
          />
        </View>
      </View>

      {/* Content Section */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Detail", {
            content: post.content,
            _id: post._id,
          });
        }}
      >
        <View style={styles.content}>
          <Text style={styles.postContent}>{post.content}</Text>
          {post.tags && (
            <Text style={styles.postTags}>{post.tags.join(", ")}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Post Image */}
      {post.imgUrl && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Detail", {
              content: post.content,
              _id: post._id,
            });
          }}
        >
          <Image
            style={styles.postImage}
            source={{
              uri: post.imgUrl,
            }}
          />
        </TouchableOpacity>
      )}

      {/* Status Section */}
      <View style={styles.status}>
        <View style={styles.likeContainer}>
          <AntDesign name="like2" size={20} color="gray" />
          <Text style={styles.statusText}>{post.likes.length}</Text>
        </View>
        <Text style={styles.statusText}>{post.comments.length} comments</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AddLike
          postId={post._id}
          refetch={refetch}
          currentLikes={currentLikes}
          setCurrentLikes={setCurrentLikes}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("Detail", {
              content: post.content,
              _id: post._id,
              showKeyboard: isCardHome,
            })
          }
        >
          <FontAwesome name="comment-o" size={20} color="gray" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-outline" size={28} color="gray" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postTime: {
    fontSize: 12,
    color: "#888",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 10,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  postTags: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  status: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  statusText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
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
