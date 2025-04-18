// backend/controllers/transactionController.js
const db = require('../config/db');

exports.createTransaction = async (req, res) => {
  try {
    const { buyer_id, seller_id, post_id, quantity, total_price, payment_method, shipping_address } = req.body;
    
    const [post] = await db.query('SELECT unit FROM posts WHERE post_id = ?', [post_id]);
    if (!post.length) return res.status(404).json({ message: 'Post not found' });

    const [result] = await db.query(
      `INSERT INTO transactions 
      (buyer_id, seller_id, post_id, quantity, unit, total_price, payment_method, shipping_address) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [buyer_id, seller_id, post_id, quantity, post[0].unit, total_price, payment_method, shipping_address]
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSellerTransactions = async (req, res) => {
  try {
    const { seller_id } = req.params;
    const [transactions] = await db.query(
      `SELECT t.*, 
       u1.name AS buyer_name, u1.email AS buyer_email, u1.mobile_no AS buyer_phone,
       u2.name AS seller_name, u2.email AS seller_email, u2.mobile_no AS seller_phone,
       p.material_id, m.material_name, m.material_category,
       c.chat_id
       FROM transactions t
       JOIN users u1 ON t.buyer_id = u1.user_id
       JOIN users u2 ON t.seller_id = u2.user_id
       JOIN posts p ON t.post_id = p.post_id
       JOIN materials m ON p.material_id = m.material_id
       LEFT JOIN chats c ON c.material_id = p.post_id AND c.buyer_id = t.buyer_id AND c.seller_id = t.seller_id
       WHERE t.seller_id = ?
       ORDER BY t.created_at DESC`,
      [seller_id]
    );
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBuyerTransactions = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const [transactions] = await db.query(
      `SELECT t.*, 
       u1.name AS buyer_name, u1.email AS buyer_email, u1.mobile_no AS buyer_phone,
       u2.name AS seller_name, u2.email AS seller_email, u2.mobile_no AS seller_phone,
       p.material_id, m.material_name, m.material_category,
       c.chat_id
       FROM transactions t
       JOIN users u1 ON t.buyer_id = u1.user_id
       JOIN users u2 ON t.seller_id = u2.user_id
       JOIN posts p ON t.post_id = p.post_id
       JOIN materials m ON p.material_id = m.material_id
       LEFT JOIN chats c ON c.material_id = p.post_id AND c.buyer_id = t.buyer_id AND c.seller_id = t.seller_id
       WHERE t.buyer_id = ?
       ORDER BY t.created_at DESC`,
      [buyer_id]
    );
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { status } = req.body;

    await db.query(
      `UPDATE transactions SET order_status = ? WHERE transaction_id = ?`,
      [status, transaction_id]
    );

    res.json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    
    await db.query(
      `DELETE FROM transactions WHERE transaction_id = ?`,
      [transaction_id]
    );

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};