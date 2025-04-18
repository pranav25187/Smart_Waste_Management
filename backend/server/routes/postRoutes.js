const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  postController.createPost
);
router.get('/my', authMiddleware, postController.getUserPosts);
router.delete('/:id', authMiddleware, postController.deletePost);
router.get('/others', authMiddleware, postController.getAllOtherPosts);
router.get('/:postId', authMiddleware, postController.getPost);
router.put('/:postId', authMiddleware, upload.single('image'), postController.updatePost);
module.exports = router;