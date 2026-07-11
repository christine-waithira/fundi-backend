import mongoose from 'mongoose';

// The Schema defines the strict rules and fields for our database entries
const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A professional name is strictly required']
  },
  skill: {
    type: String,
    required: [true, 'A specific technical skill is required'],
    enum: ['Plumber', 'Electrician', 'Mechanic', 'Cleaning Services', 'Painter'] // Limits entries to our valid app tags
  },
  location: {
    type: String,
    required: [true, 'Service location area is required']
  },
  experience: {
    type: String,
    required: [true, 'Years of experience field is required']
  },
  bio: {
    type: String,
    required: [true, 'A portfolio biography description is required']
  },
  rating: {
    type: String,
    default: '5.0 ★' // Brand new users automatically kick off with a perfect rating entry
  },
  reviews: [
    {
      client: String,
      comment: String,
      stars: String
    }
  ]
}, { 
  timestamps: true // Automatically generates createdAt and updatedAt time markers for database entries
});

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;