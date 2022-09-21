mongodb+srv://<username>:<password>@cluster0.qywml.mongodb.net/?retryWrites=true&w=majority

``` javascript
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import postModel from './models/post.js';
import userModel from './models/user.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const port = 5000;

const MONGODB_URL = 'mongodb://localhost:27017/blog-project';

mongoose
	.connect(MONGODB_URL)
	.then(() => {
		app.listen(port, () => {
			console.log(`server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.log(`${error}, server did not connect`);
	});

// POST REQUEST API
//
// create post
app.post('/posts', async (req, res) => {
	const post = req.body;

	const newPost = new postModel({ ...post, createdAt: new Date().toISOString() });

	try {
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
});

// get all post
app.get('/posts', async (req, res) => {
	try {
		const posts = await postModel.find();

		res.status(200).json(posts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

// delete a post
app.delete('/posts/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await postModel.findByIdAndRemove(id);

		res.status(200).json({ message: 'post deleted successfully' });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
});

// update a post
app.put('/posts/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const updatedData = req.body;
		const options = { new: true };
		const data = await postModel.findByIdAndUpdate(id, updatedData, options);

		res.status(200).json({ message: 'updated successfully', data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// get a single post
app.get('/posts/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const post = await postModel.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//
//
// USER LOGIN / LOGOUT API
//
// SIGN UP
app.post('/user/signup', async (req, res) => {
	const { email, password, firstName, lastName } = req.body;

	const secret = 'testJustLaughing';

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
});

// SIGN IN
app.post('/user/signin', async (req, res) => {
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
});

// get all users
app.get('/user', async (req, res) => {
	try {
		const users = await userModel.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});


// get all users
app.get('/user', async (req, res) => {
	try {
		const users = await userModel.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});
