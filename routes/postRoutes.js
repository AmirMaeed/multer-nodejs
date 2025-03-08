const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const multer = require("multer");
const path = require("path");

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });


// ✅ 1️⃣ GET: Fetch All Posts (Home Page)
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render("index", { posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ 2️⃣ GET: Show Form to Add a New Post
router.get("/addpost", (req, res) => {
    res.render("addpost");
});

// ✅ 3️⃣ POST: Create a New Post
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.filename : null;

        const newPost = new Post({ title, image, content });
        await newPost.save();

        res.redirect("/");
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ 4️⃣ GET: Fetch a Single Post (View Post Page)
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("singlepost", { post });
    } catch (error) {
        console.error("Error fetching single post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ 5️⃣ GET: Show Edit Post Form
router.get("/edit/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("editpost", { post });
    } catch (error) {
        console.error("Error fetching post for editing:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ 6️⃣ POST: Update an Existing Post
router.post("/update/:id", upload.single("image"), async (req, res) => {
    try {
        let updatedData = {
            title: req.body.title,
            content: req.body.content
        };

        // If a new image is uploaded, update it
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await Post.findByIdAndUpdate(req.params.id, updatedData);
        res.redirect("/");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ 7️⃣ POST: Delete a Post
router.post("/delete/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
