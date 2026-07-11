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
    enum: ['Plumber', 'Electrician', 'Mechanic', 'Cleaning Services', 'Painter'] 
  },
  location: {
    type: String,
    required: [true, 'Service location area is required']
  },
  experience: {
    type: String,
    required: [true, 'Years of experience field is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  bio: {
    type: String,
    required: [true, 'A portfolio biography description is required']
  },
  rating: {
    type: String,
    default: '5.0 ★' 
  },
  reviews: [
    {
      client: String,
      comment: String,
      stars: String
    }
  ],
  // 📆 The Booking Tracker Feature
  bookings: [
    {
      clientName: String,
      bookingDate: String,
      status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed'],
        default: 'Pending'
      }
    }
  ]
}, { timestamps: true });
const Provider = mongoose.model('Provider', providerSchema);
export default Provider;