// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventData: {
    name:             { type: String, required: true },
    description:      { type: String, default: '' },
    location:         { type: String, default: '' },
    isPublic:         { type: Boolean, default: true },
    rsvpDeadline:     { type: String, default: '' },
    maxParticipants:  { type: Number, default: 0 },
    tags:             { type: [String], default: [] },
  },
  dateTimeData: {
    dateMode:                 { type: String, enum: ['single','range'], required: true },
    date:                     { type: String, default: '' },
    startDate:                { type: String, default: '' },
    endDate:                  { type: String, default: '' },
    time:                     { type: String, default: '' },
    allowParticipantSelection:{ type: Boolean, default: false },
    requiredDayCount:         { type: Number, default: 0 },
  },
  activities:            { type: Array, default: [] },
  activitySupports:      { type: Array, default: [] },
  requiredActivityCount: { type: Number, default: 0 },
  requiredSupportCount:  { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
