const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}


/*
 a helper function that call in resolvers which require authentication (such as post).
 It first retrieves the Authorization header (which contains the User’s JWT) from the context.
 It then verifies the JWT and retrieves the User’s ID from it.
*/
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId
};
