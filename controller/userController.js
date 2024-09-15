const User = require('../modal/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { password } = req.body;

        // Ensure password exists and is a string
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Password must be provided as a string.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Replace plain password with hashed password
        req.body.password = hashedPassword;

        const user = new User(req.body);

        // Save the user
        try {
            const savedUser = await user.save();
        
            // Respond with the saved user data
            res.status(200).json({ data: savedUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
      
    } catch (error) {
        // Catch any unexpected errors
        return res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const data = await User.find({}, 'firstName lastName email isAdmin').lean();
        res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required.' });
        }

        // Check if the email exists in the database
        const isEmailExist = await User.findOne({ email });
        if (!isEmailExist) {
            return res.status(404).json({ error: 'User email not found.' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, isEmailExist.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: isEmailExist._id },  // Payload
            'nodejsapp',                // Secret key
            { expiresIn: '1h' }         // Token expires in 1 hour
        );

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
            httpOnly: true  // Accessible only via HTTP, not JavaScript
        });

        // Send the response back to the client
        return res.status(200).json({
            msg: 'Login successful',
            token
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async(req,res)=>{
    try {
        const {email, firstName, lastName, _id} = req.body;
         console.log(!firstName);
        if(!firstName || !lastName || !email || !_id) {
          return res.status(400).send({
              message: "First name, last name, and email are required."
          });
        }
        const userId = req.body._id;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          req.body,
          { new: true } // Return the updated user
      );
      if (!updatedUser) {
          return res.status(404).send({
              message: "User not found."
          });
      }
       // Return updated user data
       res.status(200).send({
          message: "Profile updated successfully.",
          data: updatedUser
      });
    } catch (error) {
        return res.status(500).send({
            message: "An error occurred while updating the profile.",
            error: error.message
        });
    }


   
}
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate request body
        if (!oldPassword || !newPassword) {
            return res.status(400).send({ message: "Old password and new password are required." });
        }

        // Find user and validate old password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Old password is incorrect." });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send({ message: "Password updated successfully." });
    } catch (error) {
        return res.status(500).send({ message: "An error occurred while updating the password.", error: error.message });
    }
};
exports.logout = (req, res) => {
    // Clear the token cookie
    res.cookie('token', '', {
        expires: new Date(0), // Set expiration date to the past
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
    });

    res.status(200).send({ message: 'Logged out successfully' });
};
exports.userById = async (req,res, next, id)=>{
     try {
        const user = await User.findById(id).exec()
        if (!user) {
            return res.status(404).send({ message: "User not found. " });
        }
        req.profile = user;
        next();
     } catch (error) {
        return res.status(500).send({ message: "An error occurred while updating the password.", error: error.message });
     }
   
    
}

