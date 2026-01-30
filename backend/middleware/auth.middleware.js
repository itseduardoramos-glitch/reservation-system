const jwt = require('jsonwebtoken');

//It verifies if the token exists before going to the controller
const verifyToken  = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ error: "NO token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();//If everithing is ok, it goes to the controller
    } catch (error) {
        res.status(401).json({ error: "Token invalido" });
    }
}

module.exports =  verifyToken