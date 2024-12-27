const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class FollowModel {
  static collection() {
    return database.collection("follows");
  }

  static async checkFollowing(followingId, userId) {
    const resultFollowingId = new ObjectId(String(followingId));
    const resultUserId = new ObjectId(String(userId));

    const follow = await this.collection().findOne({
      followingId: resultFollowingId,
      followerId: resultUserId,
    });

    return follow !== null;
  }

  static async remove(followingId, userId) {
    const resultFollowingId = new ObjectId(String(followingId));
    const resultUserId = new ObjectId(String(userId));

    const follow = await this.collection().findOneAndDelete({
      followingId: resultFollowingId,
      followerId: resultUserId,
    });

    return follow !== null;
  }
  static async addFollow(followingId, user) {
    const resultFollowingId = new ObjectId(String(followingId));
    const resultFollowerId = user._id;

    const data = {
      followingId: resultFollowingId,
      followerId: resultFollowerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const follow = await this.collection().insertOne(data);

    const result = {
      ...data,
      _id: follow.insertedId,
    };
    return result;
  }
}

module.exports = FollowModel;
