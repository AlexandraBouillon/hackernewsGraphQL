const { PrismaClient } = require('@prisma/client')
const { ApolloServer} = require('apollo-server');
const { PubSub} = require('graphql-subscriptions');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')


const pubsub = new PubSub()

const prisma = new PrismaClient()

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
}

//  creating the context as a function which returns the context
//  will allow your resolvers to read the Authorization header and validate if the user who submitted the request is eligible to perform the requested operation.
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
