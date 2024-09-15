const jwt = require('jsonwebtoken');
const User = require('../modal/userModel'); // Ensure correct path to your User model

exports.verifyToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        let token;

        if (authorization && authorization.startsWith('Bearer ')) {
            token = authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }

        // Verify token
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Failed to authenticate token."
                });
            }

            // Find user by ID from decoded token
            const profile = await User.findById(decoded._id);
            if (!profile) {
                return res.status(404).send({
                    message: "User not found."
                });
            }

            // Attach user profile to request object
            req.auth = decoded;
            next();
        });

    } catch (error) {
        return res.status(500).send({
            message: "An error occurred during token verification.",
            error: error.message
        });
    }
};
exports.isAuthenticated = (req,res,next) => {
    let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if(!user){
        return res.status(403).json({message:"Access denied"});
     }
   
next();
}

 exports.isAdmin = async(req,res, next)=>{
     if(!req.profile.isAdmin){
        return res.status(403).json({message:"Admin resource access denied"});

     }
    next();
 }