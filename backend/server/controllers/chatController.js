// backend/controllers/chatController.js
const db = require('../config/db');

exports.getOrCreateChat = async (req, res) => {
  try {
    const { material_id, buyer_id, seller_id } = req.body;

    // Check if chat already exists
    const [existingChat] = await db.query(
      `SELECT * FROM chats 
       WHERE material_id = ? AND buyer_id = ? AND seller_id = ?`,
      [material_id, buyer_id, seller_id]
    );

    if (existingChat.length > 0) {
      return res.json(existingChat[0]);
    }

    // Create new chat
    const [result] = await db.query(
      `INSERT INTO chats (material_id, buyer_id, seller_id)
       VALUES (?, ?, ?)`,
      [material_id, buyer_id, seller_id]
    );

    const [newChat] = await db.query(
      `SELECT * FROM chats WHERE chat_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newChat[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const [messages] = await db.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m
       JOIN users u ON m.sender_id = u.user_id
       WHERE m.chat_id = ?
       ORDER BY m.created_at ASC`,
      [chat_id]
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [chats] = await db.query(
      `SELECT c.*, 
              m.material_name,
              u1.name as buyer_name,
              u2.name as seller_name,
              (
                SELECT content 
                FROM messages 
                WHERE chat_id = c.chat_id 
                ORDER BY created_at DESC 
                LIMIT 1
              ) as last_message
       FROM chats c
       JOIN posts p ON c.material_id = p.post_id
       JOIN materials m ON p.material_id = m.material_id
       JOIN users u1 ON c.buyer_id = u1.user_id
       JOIN users u2 ON c.seller_id = u2.user_id
       WHERE c.buyer_id = ? OR c.seller_id = ?
       ORDER BY c.updated_at DESC`,
      [user_id, user_id]
    );

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

