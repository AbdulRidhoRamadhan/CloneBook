const { ObjectId } = require("mongodb");
const PostModel = require("../models/PostModel");
const redis = require("../config/redis");

const typeDefs = `#graphql
    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        author: AuthorDetail
    }

    type AuthorDetail {
        _id: ID
        name: String
        username: String
        email: String
    }

    type Comment {
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Like {
        username: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]
        postById(_id: ID): Post
    }

    type Mutation{
        addPost(content: String, tags: [String], imgUrl: String): Post
        postLike(_id: ID): Like
        postComment(content: String, postId: ID): Comment
    }
`;

const resolvers = {
  Query: {
    posts: async (_, __, contextValue) => {
      await contextValue.auth();

      const postsCache = await redis.get("post:all");

      if (postsCache) {
        // console.log("dari redis");
        return JSON.parse(postsCache);
      }

      // console.log("masuk mongodb");
      const posts = await PostModel.getAllPost();
      await redis.set("post:all", JSON.stringify(posts));
      return posts;
    },
    postById: async (_, args, contextValue) => {
      await contextValue.auth();
      const { _id } = args;
      const post = await PostModel.getPostById(_id);
      return post;
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const { _id } = await contextValue.auth();
      const { content, tags, imgUrl } = args;
      const newPost = {
        content,
        tags,
        imgUrl,
        comments: [],
        likes: [],
        authorId: _id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await PostModel.create(newPost);
      const inserted = await PostModel.getPostById(result.insertedId);

      await redis.del("post:all");

      return inserted;
    },
    postLike: async (_, args, contextValue) => {
      const user = await contextValue.auth();
      const newLike = {
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await PostModel.likePost(newLike, args._id);

      await redis.del(`post:all`);
      return {
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    postComment: async (_, args, contextValue) => {
      const user = await contextValue.auth();
      const newComments = {
        content: args.content,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await PostModel.postComment(newComments, args.postId);

      await redis.del(`post:all`);
      return {
        content: args.content,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
  },
};

module.exports = {
  postsTypeDefs: typeDefs,
  postsResolvers: resolvers,
};
