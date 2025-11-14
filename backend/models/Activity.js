import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['project', 'task', 'comment'],
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'type',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
