import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IEmailSubscriber extends Document {
  email: string;
  subscribedDate: Date;
  isActive: boolean;
  unsubscribeToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailSubscriberSchema = new Schema<IEmailSubscriber>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    subscribedDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unsubscribeToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Generate unsubscribe token before saving
emailSubscriberSchema.pre('save', function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Index for faster queries
emailSubscriberSchema.index({ email: 1 }, { unique: true });
emailSubscriberSchema.index({ isActive: 1 });
emailSubscriberSchema.index({ unsubscribeToken: 1 }, { unique: true });

export default mongoose.models.EmailSubscriber || mongoose.model<IEmailSubscriber>('EmailSubscriber', emailSubscriberSchema);
