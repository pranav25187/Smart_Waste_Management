const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Create new post
exports.createPost = async (req, res) => {
  try {
    const {
      material_name,
      material_category,
      quantity,
      unit,
      condition_status,
      description,
      price,
      location,
      available_date,
    } = req.body;

    const userId = req.userData.userId;

    // 1. Check if material exists or create new one
    const [material] = await db.query(
      `INSERT INTO materials (material_name, material_category) 
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE material_id=LAST_INSERT_ID(material_id)`,
      [material_name, material_category]
    );

    const materialId = material.insertId;

    // 2. Handle image upload
    let imagePath = null;
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      imagePath = `/uploads/${Date.now()}_${req.file.originalname}`;
      fs.writeFileSync(path.join(__dirname, '..', imagePath), req.file.buffer);
    }

    // 3. Insert post
    const [post] = await db.query(
      `INSERT INTO posts (
        user_id, material_id, quantity, unit, condition_status,
        description, price, location, available_date, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        materialId,
        quantity,
        unit,
        condition_status,
        description,
        price,
        location,
        available_date,
        imagePath
      ]
    );

    res.status(201).json({
      message: 'Post created successfully',
      postId: post.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts by current user
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.userData.userId;
    if (!userId) return res.status(400).json({ message: 'User ID not found' });

    const [posts] = await db.query(`
      SELECT 
        p.*, 
        m.material_name, 
        m.material_category,
        u.name AS user_name
      FROM posts p
      JOIN materials m ON p.material_id = m.material_id
      JOIN users u ON p.user_id = u.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts by other users (for homepage)
exports.getAllOtherPosts = async (req, res) => {
  try {
    const userId = req.userData.userId;

    const [posts] = await db.query(`
      SELECT 
        p.*, 
        m.material_name, 
        m.material_category,
        u.name AS user_name
      FROM posts p
      JOIN materials m ON p.material_id = m.material_id
      JOIN users u ON p.user_id = u.user_id
      WHERE p.user_id != ?
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const [post] = await db.query(
      'SELECT * FROM posts WHERE post_id = ? AND user_id = ?',
      [req.params.id, req.userData.userId]
    );

    if (!post.length) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    await db.query('DELETE FROM posts WHERE post_id = ?', [req.params.id]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const {
      material_name,
      material_category,
      quantity,
      unit,
      condition_status,
      description,
      price,
      location,
      available_date
    } = req.body;

    const postId = req.params.postId;
    const userId = req.userData.userId;

    // Verify post belongs to user
    const [post] = await db.query(
      `SELECT * FROM posts WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );
    
    if (!post.length) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 1. Check if material exists or create new one
    const [material] = await db.query(
      `INSERT INTO materials (material_name, material_category)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE material_id=LAST_INSERT_ID(material_id)`,
      [material_name, material_category]
    );
    const materialId = material.insertId;

    // 2. Handle file upload
    let imagePath = null;
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      imagePath = `/uploads/${Date.now()}_${req.file.originalname}`;
      fs.writeFileSync(path.join(__dirname, '..', imagePath), req.file.buffer);
    }

    // 3. Update post
    await db.query(
      `UPDATE posts SET
        material_id = ?,
        quantity = ?,
        unit = ?,
        condition_status = ?,
        description = ?,
        price = ?,
        location = ?,
        available_date = ?,
        ${imagePath ? 'image_path = ?,' : ''}
        updated_at = CURRENT_TIMESTAMP
       WHERE post_id = ?`,
      [
        materialId,
        quantity,
        unit,
        condition_status,
        description,
        price,
        location,
        available_date,
        ...(imagePath ? [imagePath] : []),
        postId
      ]
    );

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/controllers/postController.js
exports.getPost = async (req, res) => {
  try {
    const [post] = await db.query(
      `SELECT p.*, m.material_name, m.material_category
       FROM posts p
       JOIN materials m ON p.material_id = m.material_id
       WHERE p.post_id = ?`,
      [req.params.postId]
    );
    
    if (!post.length) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};