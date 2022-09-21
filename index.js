import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import postRoute from './routes/postRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
dotenv.config();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Routes
app.use('/posts', postRoute);
app.use('/user', userRoute);

const port = process.env.PORT || 5000;

const MONGODB_URL = process.env.MONGODB_URL_CONNECTION;
// const MONGODB_URL =
// 	'mongodb+srv://kelvintony:qwertyuiop@cluster0.ql55m.mongodb.net/project-x?retryWrites=true&w=majority';

app.get('/', (req, res) => {
	res.send('Welcome to netrone blog');
});

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
