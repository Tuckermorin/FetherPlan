const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: String,
  location: String,
  link: String,
  allowSuggestions: Boolean,
  votingEnabled: Boolean,
  equipmentEnabled: Boolean,
  equipmentItems: String,
  costMode: { type: String, enum: ['fixed','range'], default: 'fixed' },
  cost: Number,
  minCost: Number,
  maxCost: Number,
  allowParticipantCostSuggestion: Boolean,
    votes: [{
      userId: String,
      vote: Boolean
  }]
});

const suggestionSchema = new mongoose.Schema({
  startDate: String, // 'YYYY-MM-DD'
  endDate: String,   // optional
  time: String       // 'HH:mm'
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  date: String,          // single date
  startDate: String,     // for range
  endDate: String,       // for range
  time: String,
  description: String,
  rsvpDeadline: String,
  maxParticipants: Number,
  tags: [String],
  isPublic: { type: Boolean, default: true },
  allowDateSuggestions: { type: Boolean, default: false },
  allowTimeSuggestions: { type: Boolean, default: false },
  dateProposals: [suggestionSchema],
  timeProposals: [String],
  activities: [activitySchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
