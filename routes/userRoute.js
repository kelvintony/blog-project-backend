import express from 'express';

const router = express.Router();

//import controllers
import { register, signin } from '../controllers/userController.js';

router.post('/signup', register);
router.post('/signin', signin);

export default router;
