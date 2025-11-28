import mongoose, { Schema, Document } from 'mongoose';

export interface IImageLibrary extends Document {
  imageUrl: string;
  title: string;
  description?: string;
  uploadDate: Date;
  category: string;
  cloudinaryPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const imageLibrarySchema = new Schema<IImageLibrary>(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['painting', 'sculpture', 'sketch', 'process', 'other'],
    },
    cloudinaryPublicId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
imageLibrarySchema.index({ category: 1 });
imageLibrarySchema.index({ uploadDate: -1 });

export default mongoose.models.ImageLibrary || mongoose.model<IImageLibrary>('ImageLibrary', imageLibrarySchema);
