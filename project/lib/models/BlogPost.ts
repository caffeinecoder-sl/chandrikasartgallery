import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  publishDate?: Date;
  slug: string;
  status: 'draft' | 'published';
  wordCount: number;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishDate: Date,
    slug: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    excerpt: String,
  } as any,
  { timestamps: true }
);

// Index for faster queries
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ publishDate: -1 });

// Calculate word count before saving
blogPostSchema.pre('save', function (next) {
  this.wordCount = this.content.trim().split(/\s+/).length;
  next();
});

// Generate slug from title if not provided
blogPostSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
