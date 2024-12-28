const db = require("../models/db");
const { uploadToCloudinary } = require("../config/cloudinaryConfig");

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        posts.id, 
        posts.title, 
        posts.description, 
        posts.images, 
        users.name AS userName, 
        users.id AS userId
      FROM posts
      JOIN users ON posts.userId = users.id
    `);

    //console.log(posts);

    // Parse the JSON string in the images field
    // const formattedPosts = posts.map((post) => ({
    //   ...post,
    //   images: JSON.parse(post.images), // Ensure images is parsed into JSON
    // }));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts by a particular user
exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [user] = await db.query("SELECT * FROM Users WHERE id = ?", [userId]);
    if (!user.length) return res.status(404).json({ error: "User not found" });

    const [posts] = await db.query(
      `SELECT 
        posts.id, 
        posts.title, 
        posts.description, 
        posts.images, 
        users.name AS userName 
      FROM posts
      JOIN users ON posts.userId = users.id
      WHERE users.id = ?`,
      [userId]
    );

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    
    if (!user.length) return res.status(404).json({ error: "User not found" });

    const imageUploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );
    const imageUrls = await Promise.all(imageUploadPromises);
    
    await db.query(
      "INSERT INTO posts (title, description, images, userId) VALUES (?, ?, ?, ?)",
      [title, description, JSON.stringify(imageUrls), userId]
    );
    await db.query("UPDATE users SET postCount = postCount + 1 WHERE id = ?", [
      userId,
    ]);

    res.status(201).json({
      message: "Post created successfully",
      title,
      description,
      imageUrls,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit a post
exports.editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    const [post] = await db.query("SELECT * FROM posts WHERE id = ?", [postId]);
    if (!post.length) return res.status(404).json({ error: "Post not found" });

    // Collect fields to update dynamically
    const updates = [];
    if (title) updates.push(`title = '${title}'`);
    if (description) updates.push(`description = '${description}'`);

    // If no fields are provided, return an error
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Construct the query
    const updateQuery = `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`;

    await db.query(updateQuery, [postId]);

    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const [post] = await db.query("SELECT * FROM posts WHERE id = ?", [postId]);
    if (!post.length) return res.status(404).json({ error: "Post not found" });

    await db.query("DELETE FROM posts WHERE id = ?", [postId]);
    await db.query("UPDATE users SET postCount = postCount - 1 WHERE id = ?", [
      post[0].userId,
    ]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
