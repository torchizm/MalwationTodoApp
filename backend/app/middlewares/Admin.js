const Role = require("../models/Role");
const User = require("../models/User");

module.exports = (req, res, next) => {
    let token = req.headers["authorization"]

    if (!token) return res.status(401).json({ message: 'Access denied.' });
    token = token.split("Bearer ")[1];

    User.findOne({
        token: token
    })
    .populate('role')
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Access denied.' });
        }
        
        if (user.role === null) {
            return res.status(401).json({ message: 'Access denied.' });
        }

        if (user.role.name !== "admin") {
            return res.status(401).json({ message: 'Access denied.' });
        }

        res.locals.user = user;
        next();
    });
}