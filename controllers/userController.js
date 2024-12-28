const db = require('../models/db');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM Users');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, mobileNumber, address } = req.body;

    const [result] = await db.query(
      'INSERT INTO Users (name, mobileNumber, address, postCount) VALUES (?, ?, ?, ?)',
      [name, mobileNumber, address, 0]
    );

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
