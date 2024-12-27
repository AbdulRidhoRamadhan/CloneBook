const FollowModel = require("../models/FollowModel");

const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Mutation {
        follow (followingId : ID):  Follow
    }   
`;

const resolvers = {
  Mutation: {
    follow: async (_, args, contextValue) => {
      const user = await contextValue.auth();

      const isFollowing = await FollowModel.checkFollowing(
        args.followingId,
        user._id
      );
      if (isFollowing) {
        const remove = await FollowModel.remove(args.followingId, user._id);
        return remove;
      } else {
        return await FollowModel.addFollow(args.followingId, user);
      }
    },
  },
};

module.exports = {
  followTypeDefs: typeDefs,
  followResolvers: resolvers,
};
