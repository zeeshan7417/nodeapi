const express  = require('express');
const { route } = require('express/lib/application');
 const router = express.Router();
 let userdetails = require('../controller/userController');
 const {verifyToken, isAuthenticated, isAdmin} = require('../middleware/auth');
 router.post('/users/register', userdetails.createUser)
 router.get('/users/profile', verifyToken, userdetails.getUser),
 router.post('/users/login', userdetails.login); 
 router.put('/users/profile', verifyToken, userdetails.updateUser);
 router.get('/users/secret/:userid', verifyToken,isAuthenticated,isAdmin,   (req,res)=>{
    res.json({user: req.profile});
 })
 router.param('userid', userdetails.userById);
 router.put('/users/change-password', verifyToken, userdetails.changePassword);
router.post('/users/logout', userdetails.logout);
 module.exports = router;