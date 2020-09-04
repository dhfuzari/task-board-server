const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json")

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) // Check if Authorization header exists
        return res.status(401).send({ error: 'No token provided' });
    
    const parts = authHeader.split(' ');

    if(!parts.length === 2) // Check if token has two parts(scheme and hash)
        return res.status(401).send({ error: 'Token schema error'});

    const[scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)) // Check if scheme has the string "Bearer"
        return res.status(401).send({ error: 'Token malformatted' })

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Invalid token'});

        req.userId = decoded.id;
        return next();
    })
}