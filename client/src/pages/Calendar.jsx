import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfDay, endOfDay, isValid } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ArrowLeft, 
  Trash2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    description: '',
    location: '',
    color: '#3b82f6',
    allDay: false
  });

  // ✅ Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/events');
      // Convert date strings to Date objects
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    let eventStart = start;
    let eventEnd = end;
    let isAllDay = false;

    if (currentView === 'month') {
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        eventStart = startOfDay(start);
        eventEnd = endOfDay(new Date(end.getTime() - 1));
        isAllDay = true;
      } else {
        eventStart = startOfDay(start);
        eventEnd = endOfDay(start);
        isAllDay = true;
      }
    } else {
      const endTime = new Date(start.getTime() + 60 * 60 * 1000);
      eventEnd = end > start ? end : endTime;
      isAllDay = false;
    }
    
    setNewEvent({
      title: '',
      start: eventStart,
      end: eventEnd,
      description: '',
      location: '',
      color: '#3b82f6',
      allDay: isAllDay
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description || '',
      location: event.location || '',
      color: event.color || '#3b82f6',
      allDay: event.allDay || false
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (newEvent.end <= newEvent.start) {
      alert('End time must be after start time');
      return;
    }

    const eventToSave = {
      title: newEvent.title,
      start: newEvent.allDay ? startOfDay(newEvent.start) : newEvent.start,
      end: newEvent.allDay ? endOfDay(newEvent.end) : newEvent.end,
      description: newEvent.description,
      location: newEvent.location,
      color: newEvent.color,
      allDay: newEvent.allDay
    };

    try {
      if (isEditing && selectedEvent) {
        // Update existing event
        const { data } = await API.put(`/events/${selectedEvent._id}`, eventToSave);
        const updatedEvent = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        };
        setEvents(events.map(event => 
          event._id === selectedEvent._id ? updatedEvent : event
        ));
      } else {
        // Create new event
        const { data } = await API.post('/events', eventToSave);
        const newEventData = {
          ...data,
          start: new Date(data.start),
          end: new Date(data.end),
        };
        setEvents([...events, newEventData]);
      }

      setShowModal(false);
      setSelectedEvent(null);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        description: '',
        location: '',
        color: '#3b82f6',
        allDay: false
      });
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await API.delete(`/events/${selectedEvent._id}`);
        setEvents(events.filter(event => event._id !== selectedEvent._id));
        setShowModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || '#3b82f6',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '4px 8px'
      }
    };
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const toggleAllDay = () => {
    if (!newEvent.allDay) {
      setNewEvent({
        ...newEvent,
        start: startOfDay(newEvent.start),
        end: endOfDay(newEvent.end),
        allDay: true
      });
    } else {
      const now = new Date();
      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);
      
      setNewEvent({
        ...newEvent,
        start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), now.getHours(), 0),
        end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), now.getHours() + 1, 0),
        allDay: false
      });
    }
  };

  const handleStartChange = (e) => {
    const inputValue = e.target.value;
    if (!inputValue) return;
    
    let newStart;
    
    try {
      if (newEvent.allDay) {
        newStart = startOfDay(new Date(inputValue));
      } else {
        newStart = new Date(inputValue);
      }
      
      if (!isValid(newStart)) return;
      
      setNewEvent({ 
        ...newEvent, 
        start: newStart,
        end: newEvent.end <= newStart 
          ? (newEvent.allDay 
              ? endOfDay(newStart) 
              : new Date(newStart.getTime() + 60 * 60 * 1000))
          : newEvent.end
      });
    } catch (error) {
      console.error('Invalid start date:', error);
    }
  };

  const handleEndChange = (e) => {
    const inputValue = e.target.value;
    if (!inputValue) return;
    
    let newEnd;
    
    try {
      if (newEvent.allDay) {
        newEnd = endOfDay(new Date(inputValue));
      } else {
        newEnd = new Date(inputValue);
      }
      
      if (!isValid(newEnd)) return;
      
      setNewEvent({ ...newEvent, end: newEnd });
    } catch (error) {
      console.error('Invalid end date:', error);
    }
  };

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
  ];

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const label = () => {
      const date = toolbar.date;
      return (
        <span className="text-white font-semibold text-lg">
          {format(date, 'MMMM yyyy')}
        </span>
      );
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToBack}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="ml-4">
            {label()}
          </div>
        </div>

        <div className="flex gap-2">
          {['month', 'week', 'agenda'].map((view) => (
            <button
              key={view}
              onClick={() => toolbar.onView(view)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                toolbar.view === view
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    My Schedule
                  </h1>
                  <p className="text-gray-400 text-sm">Plan and track your activities</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                setNewEvent({
                  title: '',
                  start: now,
                  end: oneHourLater,
                  description: '',
                  location: '',
                  color: '#3b82f6',
                  allDay: false
                });
                setShowModal(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Event
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="card p-6">
          <div className="calendar-container" style={{ height: '700px' }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              view={currentView}
              date={currentDate}
              selectable
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'agenda']}
              popup
              step={30}
              timeslots={2}
              min={new Date(1970, 1, 1, 6, 0, 0)}
              max={new Date(1970, 1, 1, 23, 59, 59)}
              components={{
                toolbar: CustomToolbar
              }}
              style={{ height: '100%' }}
            />
          </div>
        </div>

        {/* Event Modal - Same as before */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Event' : 'New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEvent(null);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={newEvent.allDay}
                    onChange={toggleAllDay}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="allDay" className="text-sm font-medium text-gray-300 cursor-pointer">
                    All Day Event
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {newEvent.allDay ? 'Start Date *' : 'Start Time *'}
                  </label>
                  <input
                    type={newEvent.allDay ? "date" : "datetime-local"}
                    value={newEvent.allDay 
                      ? format(newEvent.start, "yyyy-MM-dd")
                      : format(newEvent.start, "yyyy-MM-dd'T'HH:mm")
                    }
                    onChange={handleStartChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {newEvent.allDay ? 'End Date *' : 'End Time *'}
                  </label>
                  <input
                    type={newEvent.allDay ? "date" : "datetime-local"}
                    value={newEvent.allDay 
                      ? format(newEvent.end, "yyyy-MM-dd")
                      : format(newEvent.end, "yyyy-MM-dd'T'HH:mm")
                    }
                    onChange={handleEndChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Add details about your event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="input-field"
                    placeholder="Add location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewEvent({ ...newEvent, color: color.value })}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          newEvent.color === color.value
                            ? 'ring-2 ring-white'
                            : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {isEditing && (
                    <button
                      onClick={handleDeleteEvent}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Delete
                    </button>
                  )}
                  <button
                    onClick={handleSaveEvent}
                    className="flex-1 btn-primary"
                  >
                    {isEditing ? 'Update' : 'Save'} Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Calendar Styles - Same as before */}
      <style>{`
  .calendar-container .rbc-calendar {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
  }
  
  .rbc-header {
    color: #9ca3af;
    font-weight: 600;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-today {
    background-color: rgba(59, 130, 246, 0.1);
  }
  
  .rbc-off-range-bg {
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .rbc-date-cell {
    color: #d1d5db;
    padding: 8px;
  }
  
  .rbc-month-view, .rbc-time-view {
    border: none;
  }
  
  .rbc-month-row, .rbc-day-bg {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .rbc-event {
    padding: 4px 8px;
    font-size: 13px;
    font-weight: 500;
  }
  
  /* ✅ CENTER EVENT TITLE */
  .rbc-event-content {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* ✅ HIDE TIME LABEL IN MONTH VIEW */
  .rbc-event-label {
    display: none;
  }
  
  .rbc-allday-cell {
    height: auto;
    min-height: 40px;
  }
  
  .rbc-time-slot {
    color: #6b7280;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-time-column {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-timeslot-group {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-day-slot .rbc-time-slot {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .rbc-current-time-indicator {
    background-color: #ef4444;
    height: 2px;
  }
  
  .rbc-time-header-content {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-time-content {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .rbc-label {
    color: #9ca3af;
    padding: 0 5px;
  }
  
  .rbc-agenda-view {
    color: #d1d5db;
  }
  
  .rbc-agenda-view table {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .rbc-agenda-table tbody > tr > td {
    border-color: rgba(255, 255, 255, 0.1);
    padding: 12px;
  }
  
  .rbc-agenda-date-cell, .rbc-agenda-time-cell {
    color: #9ca3af;
  }
  
  .rbc-agenda-event-cell {
    color: #e5e7eb;
  }
`}</style>
    </div>
  );
};

export default Calendar;