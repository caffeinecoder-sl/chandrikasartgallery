import mongoose, { Schema, Document } from 'mongoose';

export interface IArtProduct extends Document {
  title: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  status: 'available' | 'sold';
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const artProductSchema = new Schema<IArtProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['painting', 'sculpture', 'print', 'craft', 'other'],
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
  } as any,
  { timestamps: true }
);

// Index for faster queries
artProductSchema.index({ status: 1 });
artProductSchema.index({ category: 1 });
artProductSchema.index({ price: 1 });

export default mongoose.models.ArtProduct || mongoose.model<IArtProduct>('ArtProduct', artProductSchema);
