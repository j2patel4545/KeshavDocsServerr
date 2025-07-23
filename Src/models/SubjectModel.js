import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  index_number: Number, // ➕ Add this
  name: String,
  description: String,
  code: String,
});

const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  topic: [topicSchema],
});

export const Subject = mongoose.model('Subject', subjectSchema);
