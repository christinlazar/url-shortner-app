const jwt = require('jsonwebtoken');
const generateToken = async (req, res) => {
  try {
    const user = req.user;
    
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, message: 'Authentication successful' });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = { generateToken };
