// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/seller/:seller_id', authMiddleware, transactionController.getSellerTransactions);
router.get('/buyer/:buyer_id', authMiddleware, transactionController.getBuyerTransactions);
router.patch('/:transaction_id/status', authMiddleware, transactionController.updateTransactionStatus);
router.delete('/:transaction_id', authMiddleware, transactionController.deleteTransaction);

module.exports = router;