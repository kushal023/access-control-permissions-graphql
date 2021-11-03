const { ApolloError } = require('apollo-server-express');
const tweets = require('./data');
const { combineResolvers } = require('graphql-resolvers');
const { isLoggedin } = require('./middlewares');

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    hello: () => 'Hello world!',
    tweets: () => {
      return tweets;
    },
    tweet: combineResolvers(isLoggedin, (_, { id }) => {
      if (!user) return new ForbiddenError('Not Authorized');
      const tweetId = tweets.findIndex((tweet) => tweet.id === id);
      if (tweetId === -1) return new ApolloError('Tweet not found');
      return tweets[tweetId];
    }),
  },
};
