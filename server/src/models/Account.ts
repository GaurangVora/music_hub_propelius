import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  displayName: string;
  emailAddress: string;
  secretKey: string;
  collections: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  secretKey: {
    type: String,
    required: true,
    minlength: 6
  },
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'Collection'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IAccount>('Account', accountSchema); 