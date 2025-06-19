const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.use((req, _, next) => {
  console.log('EventRoutes got:', req.method, req.path);
  next();
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    console.log('EventRoutes POST body:', req.body);     
    const evt = new Event(req.body);
    const saved = await evt.save();
    console.log('Event saved:', saved);      
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  console.log('EventRoutes got: GET');  
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const evt = await Event.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });
    res.json(evt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Suggest date/time proposals
router.put('/:id/suggestions', async (req, res) => {
  // expects { proposals: [{startDate,endDate,time}], type: 'date'|'time'|'both' }
  try {
    const { proposals, type } = req.body;
    const evt = await Event.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    if (type === 'date' || type === 'both') {
      evt.dateProposals.push(...proposals.map(p => ({ startDate: p.startDate, endDate: p.endDate })));
    }
    if (type === 'time' || type === 'both') {
      evt.timeProposals.push(...proposals.map(p => p.time));
    }

    const updated = await evt.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vote on an activity
router.put('/:id/activities/:actId/vote', async (req, res) => {
  // expects { userId, vote: true|false }
  try {
    const { userId, vote } = req.body;
    const evt = await Event.findById(req.params.id);
    if (!evt) return res.status(404).json({ message: 'Event not found' });

    const act = evt.activities.id(req.params.actId);
    if (!act) return res.status(404).json({ message: 'Activity not found' });

    // simplistic voting model: you could push to an array, etc.
    act.votes = act.votes || [];
    act.votes.push({ userId, vote });
    await evt.save();
    res.json(evt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
