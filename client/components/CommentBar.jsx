import { Image, Text, View } from "react-native";

export default function CommentBar({ comment }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: `https://avatar.iran.liara.run/public?username=${comment.username}`,
        }}
        style={{
          width: 40,
          height: 40,
        }}
      />
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          {comment.username}
        </Text>
        <Text
          style={{
            backgroundColor: "#f3f3f3",
            padding: 8,
            borderRadius: 6,
            paddingHorizontal: 14,
            borderTopLeftRadius: 0,
          }}
        >
          {comment.content}
        </Text>
      </View>
    </View>
  );
}
