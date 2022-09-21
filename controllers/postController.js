import postModel from '../models/post.js';

// create post
export const createPost = async (req, res) => {
	const post = req.body;

	const newPost = new postModel({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

	try {
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

// get all post
export const getPosts = async (req, res) => {
	try {
		const posts = await postModel.find();

		res.status(200).json(posts);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

// delete a post
export const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		await postModel.findByIdAndRemove(id);

		res.status(200).json({ message: 'post deleted successfully' });
	} catch (error) {
		res.status(409).json({ error: error.message });
	}
};

// update a post
export const updatePost = async (req, res) => {
	const { id } = req.params;

	try {
		const updatedData = req.body;
		const options = { new: true };
		const data = await postModel.findByIdAndUpdate(id, updatedData, options);

		res.status(200).json({ message: 'updated successfully', data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// get a single post
export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await postModel.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
