
//accesses the prisma object via the context
function feed(parent, args, context, info) {
  return context.prisma.link.findMany()
}

module.exports = {
  feed,
}
