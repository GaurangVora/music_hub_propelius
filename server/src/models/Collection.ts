import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  tracks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>({
  title: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  tracks: [{
    type: Schema.Types.ObjectId,
    ref: 'Track'
  }]
}, {
  timestamps: true
});

export default mongoose.model<ICollection>('Collection', collectionSchema); 