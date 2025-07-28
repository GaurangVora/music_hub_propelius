import mongoose, { Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  spotifyTrackId: string;
  trackName: string;
  performer: string;
  recordTitle: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const trackSchema = new Schema<ITrack>({
  spotifyTrackId: {
    type: String,
    required: true,
    unique: true
  },
  trackName: {
    type: String,
    required: true,
    trim: true
  },
  performer: {
    type: String,
    required: true,
    trim: true
  },
  recordTitle: {
    type: String,
    required: true,
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<ITrack>('Track', trackSchema); 