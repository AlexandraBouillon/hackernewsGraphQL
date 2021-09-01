const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
// import { readFileSync } from 'fs';
const  readFileSync =  fs.readFileSync()

const prisma = new PrismaClient()
//  Context object that’s passed into all GraphQL resolvers is being initialized
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})


// adding a new integer variable that simply serves as a very rudimentary way to generate unique IDs for newly created Link elements.
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    //accesses the prisma object via the context
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
  },
  Mutation: {
    // implementation of the post resolver first creates a new link object,
    // then adds it to the existing links list and finally returns the new link.
     post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
  },
}

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
