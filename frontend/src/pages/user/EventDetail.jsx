import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetail.css";
import { getEventById } from "../../services/eventService";
import { purchaseTicket } from "../../services/ticketService";
import { processPayment } from "../../services/paymentService";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await getEventById(id);
      
      if (response.success) {
        setEvent(response.event);
      } else {
        alert("Event not found");
        navigate("/event");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      alert("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    if (!event) return 0;
    const basePrice = selectedTicket === "vip" ? event.price * 1.5 : event.price;
    return basePrice * quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please login first");
      navigate("/SignIn");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setProcessing(true);

      const totalPrice = calculateTotal();

      // Step 1: Create Ticket First
      console.log('Creating ticket...');
      const ticketResponse = await purchaseTicket({
        eventId: id,
        userId: username,
        quantity: quantity,
        totalPrice: totalPrice
      });

      if (!ticketResponse.success) {
        alert("Ticket creation failed: " + ticketResponse.message);
        setProcessing(false);
        return;
      }

      console.log('Ticket created:', ticketResponse.ticket);

      // Step 2: Process Payment
      console.log('Processing payment...');
      const paymentResponse = await processPayment({
        user_id: username,
        event_id: id,
        amount: totalPrice,
        method: "credit_card",
        ticket_id: ticketResponse.ticket.id
      });

      if (!paymentResponse.success) {
        alert("Payment failed: " + paymentResponse.message);
        setProcessing(false);
        return;
      }

      console.log('Payment successful:', paymentResponse);

      // Success!
      alert(`🎉 Ticket purchased successfully!\n\nTicket Code: ${ticketResponse.ticket.ticketCode}\nTransaction ID: ${paymentResponse.transaction_id}\n\nPlease check your tickets in "My Tickets" page.`);
      navigate("/MyTickets");

    } catch (err) {
      console.error("Purchase error:", err);
      alert("An error occurred during purchase: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="event-detail-page py-5 p-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page py-5 p-5">
        <div className="alert alert-danger">Event not found</div>
      </div>
    );
  }

  return (
    <div className="event-detail-page py-5 p-5">
      <h3 className="fw-bold mb-4">Event Details</h3>

      <div className="row g-5">
        {/* Left Side - Event Info */}
        <div className="col-md-6">
          <img
            src={`/${event.imageUrl || "event1.jpg"}`}
            alt={event.title}
            className="img-fluid rounded mb-4 shadow-sm"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/event1.jpg';
            }}
          />
          <h4 className="fw-bold">{event.title}</h4>
          <span className="badge bg-secondary mb-3">{event.category}</span>
          <p className="fw-semibold mt-2 mb-1">📅 Date: {event.date}</p>
          <p className="fw-semibold mb-1">🕐 Time: {event.time}</p>
          <p className="fw-semibold mb-3">📍 Location: {event.location}</p>
          <p className="text-secondary">{event.description}</p>
          <p className="fw-bold">
            🎫 Available Tickets: <span className="text-success">{event.availableTickets}</span> / {event.capacity}
          </p>
          <p className="fw-bold text-primary fs-5">
            💰 Price: Rp {event.price.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Right Side - Ticket Form */}
        <div className="col-md-6">
          <div className="ticket-options d-flex gap-4 mb-4">
            <label
              className={`ticket-card shadow-sm ${
                selectedTicket === "regular" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="ticketType"
                value="regular"
                checked={selectedTicket === "regular"}
                onChange={() => setSelectedTicket("regular")}
              />
              <div className="ticket-info">
                <h6 className="fw-semibold mb-1">Regular</h6>
                <p className="mb-0 price">
                  Rp {event.price.toLocaleString('id-ID')}
                </p>
              </div>
            </label>

            <label
              className={`ticket-card shadow-sm ${
                selectedTicket === "vip" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="ticketType"
                value="vip"
                checked={selectedTicket === "vip"}
                onChange={() => setSelectedTicket("vip")}
              />
              <div className="ticket-info">
                <h6 className="fw-semibold mb-1">VIP Pass</h6>
                <p className="mb-0 price">
                  Rp {(event.price * 1.5).toLocaleString('id-ID')}
                </p>
              </div>
            </label>
          </div>

          <form className="ticket-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="form-control mb-3"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="form-control mb-3"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                max={Math.min(event.availableTickets, 10)}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
              <small className="text-muted">Maximum 10 tickets per transaction</small>
            </div>

            {selectedTicket && (
              <div className="alert alert-info">
                <div className="d-flex justify-content-between mb-1">
                  <span>Ticket Type:</span>
                  <strong>{selectedTicket.toUpperCase()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Quantity:</span>
                  <strong>{quantity}x</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Price per ticket:</span>
                  <strong>Rp {(selectedTicket === "vip" ? event.price * 1.5 : event.price).toLocaleString('id-ID')}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong> 
                  <strong className="text-primary fs-5">Rp {calculateTotal().toLocaleString('id-ID')}</strong>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-buy"
              disabled={!selectedTicket || processing || event.availableTickets === 0}
            >
              {processing 
                ? "Processing Purchase..." 
                : event.availableTickets === 0 
                  ? "Sold Out"
                  : selectedTicket 
                    ? `Buy ${selectedTicket.toUpperCase()} Ticket` 
                    : "Choose Ticket Type"}
            </button>

            {processing && (
              <div className="text-center mt-3">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="text-muted">Please wait, processing your purchase...</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;