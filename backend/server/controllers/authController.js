const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password, mobileNo, address } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile_no: mobileNo,
      address
    });

    const token = jwt.sign(
      { email, id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      user: { user_id: userId, name, email, mobile_no: mobileNo, address },
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        mobile_no: user.mobile_no,
        address: user.address
      },
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const forgotPassword = (req, res) => {
  // Your forgot password logic here
  res.status(501).json({ message: "Forgot password not implemented yet" });
};

module.exports = {
  signup,
  login,
  forgotPassword
};
