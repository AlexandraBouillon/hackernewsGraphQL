// implementation of the post resolver first creates a new link object,
    // then adds it to the existing links list and finally returns the new link.
async function signup(parent, args, context, info) {
  //  encrypt the User’s password using the bcryptjs library
  const password = await bcrypt.hash(args.password, 10)

  // use PrismaClient instance (via prisma context) to store the new User record in the database.
  const user = await context.prisma.user.create({ data: { ...args, password } })

  // generating a JSON Web Token which is signed with an APP_SECRET.
  // -[x] create this APP_SECRET and also install the jwt library
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // return the token and the user in an object that adheres to the shape of an AuthPayload object from GraphQL schema.
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  // using your PrismaClient instance to retrieve an existing User record by the email address that was sent along as an argument in the login mutation.
  // If no User with that email address was found, you’re returning a corresponding error.
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  // compare the provided password with the one that is stored in the database.
  // If the two don’t match, you’re returning an error
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  //  returning token and user
  return {
    token,
    user,
  }
}
async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
  context.pubsub.publish("NEW_LINK", newLink)

  return newLink
}


module.exports = {
  signup,
  login,
  post,
}
