import userModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// SIGN UP
export const register = async (req, res) => {
	const { email, password, firstName, lastName } = req.body;

	const secret = process.env.JWT_SECRET;

	try {
		const oldUser = await userModel.findOne({ email });

		if (oldUser) {
			return res.status(400).json({ message: 'User Already Exist' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const result = await userModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

		const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: '1h' });

		res.status(201).json({ result, token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// SIGN IN
export const signin = async (req, res) => {
	const { email, password } = req.body;

	const secret = 'testJustLaughing';

	try {
		const oldUser = await userModel.findOne({ email });

		if (!oldUser) {
			return res.status(404).json({ message: 'User Does not Exist' });
		}

		const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '1h' });

		res.status(200).json({ result: oldUser, token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
