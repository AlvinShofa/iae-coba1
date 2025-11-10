import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Event.css";
import { FaSearch } from "react-icons/fa";
import { getAllEvents } from "../../services/eventService";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents({
        page: 1,
        limit: 20,
        category: category,
        search: search
      });

      if (response.success) {
        setEvents(response.events || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="event-page p-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-page p-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="event-page p-5">
      <div className="event-content container">
        <div className="event-header">
          <h2>Events</h2>
          <form onSubmit={handleSearch} className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <select 
            className="form-select w-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No events found.</p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <Link 
                to={`/event/${event.id}`} 
                key={event.id}
                className="text-decoration-none"
              >
                <div className="event-card">
                  <img 
                    src={event.imageUrl || 'event1.jpg'} 
                    alt={event.title}
                    onError={(e) => {
                      e.target.src = 'event1.jpg'; // Fallback image
                    }}
                  />
                  <div className="event-info">
                    <h5>{event.title}</h5>
                    <p className="text-muted small">{event.date} • {event.time}</p>
                    <p className="text-muted small">{event.location}</p>
                    <p className="fw-bold text-primary">
                      Rp {event.price.toLocaleString('id-ID')}
                    </p>
                    <span className="badge bg-secondary">{event.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;