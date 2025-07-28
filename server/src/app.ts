import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import accountRoutes from './routes/accountRoutes';
import collectionRoutes from './routes/collectionRoutes';
import trackRoutes from './routes/trackRoutes';


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', accountRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api', trackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-hub';
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
  });
};

startServer(); 