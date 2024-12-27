const UserModel = require("../models/UserModel");

const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
        followingDetails: [followingDetails]
        followerDetails: [followerDetails]
    }

    type followingDetails {
        _id: ID
        name: String
        username: String
        email: String
    }

    type followerDetails {
        _id: ID
        name: String
        username: String
        email: String
    }
    
    type LoginResponse {
        access_token: String
        message: String
        userId: ID
    }

    type Query {
        users: [User]
        getUserProfile(_id: ID): User
        userByUsername(username: String): [User]
    }

    type Mutation {
        addUser(name: String, username:String, email:String, password:String): User
        login(username: String, password:String): LoginResponse
    }
`;

const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      await contextValue.auth();
      const users = await UserModel.getAll();
      return users;
    },
    getUserProfile: async (_, args, contextValue) => {
      await contextValue.auth();
      const { _id } = await contextValue.auth();
      // if (_id === undefined) {
      //   _id = await contextValue.auth();
      // }
      console.log(args);
      const user = await UserModel.getUserProfile(_id);
      return user;
    },
    userByUsername: async (_, args, contextValue) => {
      await contextValue.auth();
      const { username } = args;
      const user = await UserModel.searchByUsername(username);
      return user;
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const newUser = args;
      const result = await UserModel.register(newUser);
      newUser._id = result.insertedId;

      return newUser;
    },

    login: async (_, args) => {
      const { username, password } = args;
      const { access_token, userId } = await UserModel.login({
        username,
        password,
      });
      return {
        access_token,
        message: "Login Success",
        userId,
      };
    },
  },
};

module.exports = {
  usersTypeDefs: typeDefs,
  usersResolvers: resolvers,
};
