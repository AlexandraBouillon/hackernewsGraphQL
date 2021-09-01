const { ApolloServer } = require('apollo-server');

// Defining a new Link type that represents the links that can be posted to Hacker News.
// Each Link has an id, a description, and a url.
//  it’s not needed any more because the schema definition now lives in its own file(schema.graphql)
// const typeDefs = `
//   type Query {
//     info: String!
//     feed: [Link!]!
//   }

//   type Mutation {
//     post(url: String!, description: String!): Link!
//   }

//   type Link {
//     id: ID!
//     description: String!
//     url: String!
//   }
// `
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

// 1
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // 2
    post: (parent, args) => {

    let idCount = links.length

       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    }
  },
}

// 3
const server = new ApolloServer({
  // typeDefs,
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
