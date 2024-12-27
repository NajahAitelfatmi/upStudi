import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import moment from "moment";
import { db } from "./db.js";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow your frontend
    credentials: true, // Required for cookies
  })
);

// Role-based access control middleware
const checkUserRole = (role) => {
  return (req, res, next) => {
    const user = req.user; // Assuming user info is added to req via authentication
    if (user && user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
  };
};

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "client/public/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Fetch Comments for a Post
app.get("/api/comments/:postId", (req, res) => {
  const postId = req.params.postId;
  const query = "SELECT * FROM comments WHERE postId = ? ORDER BY date ASC";
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch comments." });
    }
    res.json(results);
  });
});

// Add a New Comment
app.post("/api/comments", (req, res) => {
  const { postId, userId, text } = req.body;

  // Fetch username from users table
  const userQuery = "SELECT username FROM users WHERE id = ?";
  db.query(userQuery, [userId], (err, userResult) => {
    if (err || userResult.length === 0) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch user." });
    }

    const username = userResult[0].username;
    const query =
      "INSERT INTO comments (postId, userId, username, text, date) VALUES (?, ?, ?, ?, ?)";
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    db.query(query, [postId, userId, username, text, date], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add comment." });
      }

      res.json({
        id: result.insertId,
        postId,
        userId,
        username,
        text,
        date,
      });
    });
  });
});

// Upload a document (admin only)
app.post(
  "/api/documents/upload",
  checkUserRole("admin"),
  upload.single("document"),
  (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No document uploaded." });
    }

    res.status(200).json({
      message: "Document uploaded successfully.",
      filename: file.filename,
    });
  }
);

// Download a document
app.get("/api/documents/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "client/public/upload", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to download the document." });
    }
  });
});

// Fetch all uploaded documents
app.get("/api/documents", (req, res) => {
  const directoryPath = path.join(process.cwd(), "client/public/upload");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve documents." });
    }

    res.json(files);
  });
});

// Server listening
app.listen(8800, () => {
  console.log("Backend server is running on port 8800!");
});
