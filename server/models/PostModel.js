const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class PostModel {
  static collection() {
    return database.collection("posts");
  }

  static async getAllPost() {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          "author.password": 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const posts = await this.collection().aggregate(pipeline).toArray();
    return posts;
  }

  static async getPostById(id) {
    const _id = new ObjectId(String(id));

    const pipeline = [
      {
        $match: {
          _id: _id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          "author.password": 0,
        },
      },
    ];
    const result = await this.collection().aggregate(pipeline).next();

    if (result) {
      result.createdAt = result.createdAt.toISOString();
      result.updatedAt = result.updatedAt.toISOString();
    }

    return result;
  }

  static async create(post) {
    if (!post.content) {
      throw new Error("Content is required");
    }
    if (!post.authorId) {
      throw new Error("Author is required");
    }
    post.createdAt = post.updatedAt = new Date();
    const newPost = await this.collection().insertOne(post);
    return newPost;
  }

  static async likePost(likes, id) {
    if (!likes.username) {
      throw new Error("Username is required for liking a post");
    }

    const result = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $push: { likes } }
    );

    return result;
  }

  static async postComment(comments, postId) {
    if (!comments.content) {
      throw new Error("Comment content is required");
    }
    if (!comments.username) {
      throw new Error("Username is required");
    }

    const result = await this.collection().updateOne(
      { _id: new ObjectId(String(postId)) },
      { $push: { comments } }
    );

    return result;
  }
  model;
}

module.exports = PostModel;
