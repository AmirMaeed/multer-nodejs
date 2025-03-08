require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const postRoutes = require("./routes/postRoutes");
const postModel = require("./models/postModel");
const app = express();
const db =require("./config/db");
db();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/posts", postRoutes);

// Home Page: Fetch All Posts
const Post = require("./models/postModel");
const connectDB = require("./config/db");
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("index", { posts });
  } catch (error) {
    res.status(500).send("Error fetching posts");
  }
});

  
  
  // Route to render the Add Post page
app.get("/addpost", (req, res) => {
    res.render("addpost"); // Render the addpost.ejs file
});

  
// Start server
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
