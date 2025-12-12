const Event = require('../models/Event');

// @desc    Get all events for logged-in user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ start: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, start, end, description, location, color, allDay } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Please add title, start and end time' });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      start,
      end,
      description,
      location,
      color,
      allDay,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};