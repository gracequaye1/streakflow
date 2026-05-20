const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("Register attempt:", { name, email });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    console.log("User created:", user._id);

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);  // <-- this line
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);  // <-- this line
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};