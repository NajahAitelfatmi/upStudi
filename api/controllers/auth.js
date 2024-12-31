// Import necessary modules
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js"; // Make sure this is correctly configured

// Register function
export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users(`userType`,`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.userType, req.body.username, req.body.email, hash]; // Use the hashed password

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

// Login function
export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "none" })
      .status(200)
      .json(other);  // Send the user data minus password
  });
};


// Logout function
export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true, // Only clear the cookie if sent over HTTPS
    })
    .status(200)
    .json("User has been logged out.");
};