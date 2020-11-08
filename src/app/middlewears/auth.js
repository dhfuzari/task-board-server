const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) { return res.status(401).send({ error: 'No token provided' }); }

  const parts = authHeader.split(' ');

  // Check if token has two parts(scheme and hash)
  if (!parts.length === 2) { return res.status(401).send({ error: 'Token schema error' }); }

  const [scheme, token] = parts;

  // Check if scheme has the string "Bearer"
  if (!/^Bearer$/i.test(scheme)) { return res.status(401).send({ error: 'Token malformatted' }); }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });

    req.userId = decoded.id;
    return next();
  });
};
