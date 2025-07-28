import express from 'express';
import Collection from '../models/Collection';
import Account from '../models/Account';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.get('/', verifyToken, async (req: any, res) => {
  try {
    const collections = await Collection.find({ owner: req.user.userId })
      .populate('tracks')
      .sort({ createdAt: -1 });
    
    res.json(collections);
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', verifyToken, async (req: any, res) => {
  try {
    const collection = await Collection.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    }).populate('tracks');
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    res.json(collection);
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, async (req: any, res) => {
  try {
    const { title, description } = req.body;
    
    const collection = new Collection({
      title,
      description: description || '',
      owner: req.user.userId
    });
    
    await collection.save();
    
    await Account.findByIdAndUpdate(
      req.user.userId,
      { $push: { collections: collection._id } }
    );
    
    res.status(201).json(collection);
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req: any, res) => {
  try {
    const { title, description } = req.body;
    
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { title, description: description || '' },
      { new: true }
    );
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    res.json(collection);
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, async (req: any, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    await Account.findByIdAndUpdate(
      req.user.userId,
      { $pull: { collections: req.params.id } }
    );
    
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 