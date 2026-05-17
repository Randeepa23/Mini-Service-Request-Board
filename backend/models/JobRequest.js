const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  category:     { type: String, enum: ['Plumbing','Electrical','Painting','Joinery'] },
  location:     { type: String },
  contactName:  { type: String },
  contactEmail: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobRequest', jobSchema);