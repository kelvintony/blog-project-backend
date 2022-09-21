import express from 'express';

const router = express.Router();

//import controllers
import { createPost, getPosts, deletePost, updatePost, getPost } from '../controllers/postController.js';
import auth from '../middleware/auth.js';

router.post('/', auth, createPost);
router.get('/', getPosts);
router.delete('/:id', auth, deletePost);
router.put('/:id', auth, updatePost);
router.get('/:id', auth, getPost);

export default router;
