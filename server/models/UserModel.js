const { database } = require("../config/mongodb");
const { hashPass, comparePass } = require("../helpers/bcrypt");
const validateEmail = require("../helpers/email");
const { signToken } = require("../helpers/jwt");
const { ObjectId } = require("mongodb");

class UserModel {
  static collection() {
    return database.collection("users");
  }

  static findByUsername(username) {
    return this.collection().findOne({ username });
  }

  static findByEmail(email) {
    return this.collection().findOne({ email });
  }

  static async getAll() {
    const users = await this.collection().find().toArray();
    return users;
  }

  static async findById(_id) {
    const user = await this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
    return user;
  }

  static async register(user) {
    if (!user.username) {
      throw new Error("Username is required");
    }

    if (!user.email) {
      throw new Error("Email is required");
    }

    if (!user.password) {
      throw new Error("Password is required");
    }

    if (user.password.length < 5) {
      throw new Error("Password must be at least 5 characters");
    }

    const isValidEmail = validateEmail(user.email);
    if (!isValidEmail) throw new Error("Email format is invalid");

    const existUsername = await this.findByUsername(user.username);
    if (existUsername) {
      throw new Error("Username must be unique");
    }

    const existEmail = await this.findByEmail(user.email);
    if (existEmail) {
      throw new Error("Email must be unique");
    }

    user.password = hashPass(user.password);

    const newUser = await this.collection().insertOne(user);
    return newUser;
  }

  static async login(user) {
    const { username, password } = user;

    if (!username) {
      throw new Error("Username is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const foundUser = await this.findByUsername(username);

    if (!foundUser) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = comparePass(password, foundUser.password);

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const access_token = signToken({
      _id: foundUser._id,
      username: foundUser.username,
    });

    return { access_token, userId: foundUser._id };
  }

  static async searchByUsername(username) {
    const users = await this.collection()
      .find({ username: { $regex: username, $options: "i" } })
      .toArray();
    return users;
  }

  static async getUserProfile(_id) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(String(_id)),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers.followerId",
          foreignField: "_id",
          as: "followerDetails",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followings.followingId",
          foreignField: "_id",
          as: "followingDetails",
        },
      },
      {
        $project: {
          password: false,
          "followingDetails.password": false,
          "followerDetails.password": false,
        },
      },
    ];

    const user = this.collection().aggregate(pipeline).next();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = UserModel;
