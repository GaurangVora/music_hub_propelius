import express from 'express';
import Collection from '../models/Collection';
import Track from '../models/Track';
import { verifyToken } from '../middleware/verifyToken';
import { searchTracks } from '../services/spotifyService';

const router = express.Router();

router.post('/collections/:collectionId/tracks', verifyToken, async (req: any, res) => {
  try {
    const { collectionId } = req.params;
    const { spotifyTrackId, trackName, performer, recordTitle, coverImage } = req.body;

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      owner: req.user.userId 
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    let track = await Track.findOne({ spotifyTrackId });

    if (!track) {
      track = new Track({
        spotifyTrackId,
        trackName,
        performer,
        recordTitle,
        coverImage: coverImage || ''
      });
      await track.save();
    }

    if (collection.tracks.includes(track._id as any)) {
      return res.status(400).json({ message: 'Track already in collection' });
    }

    collection.tracks.push(track._id as any);
    await collection.save();

    await collection.populate('tracks');

    res.json(collection);
  } catch (error) {
    console.error('Add track error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/collections/:collectionId/tracks/:trackId', verifyToken, async (req: any, res) => {
  try {
    const { collectionId, trackId } = req.params;

    const collection = await Collection.findOne({ 
      _id: collectionId, 
      owner: req.user.userId 
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.tracks = collection.tracks.filter(
      (track: any) => track.toString() !== trackId
    );
    await collection.save();

    await collection.populate('tracks');

    res.json(collection);
  } catch (error) {
    console.error('Remove track error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', verifyToken, async (req: any, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchResults = await searchTracks(q as string, 10);
    res.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search tracks' });
  }
});

export default router; 