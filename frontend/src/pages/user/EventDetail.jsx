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

    const userId = localStorage.getItem("username");
    if (!userId) {
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

      // Step 1: Process Payment
      const paymentResponse = await processPayment({
        user_id: userId,
        event_id: id,
        amount: totalPrice,
        method: "credit_card" // Could be dynamic
      });

      if (!paymentResponse.success) {
        alert("Payment failed: " + paymentResponse.message);
        return;
      }

      // Step 2: Create Ticket
      const ticketResponse = await purchaseTicket({
        eventId: id,
        userId: userId,
        quantity: quantity,
        totalPrice: totalPrice
      });

      if (ticketResponse.success) {
        alert(`Ticket purchased successfully! Code: ${ticketResponse.ticket.ticketCode}`);
        navigate("/MyTickets");
      } else {
        alert("Ticket purchase failed: " + ticketResponse.message);
      }

    } catch (err) {
      console.error("Purchase error:", err);
      alert("An error occurred during purchase. Please try again.");
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
            src={event.imageUrl || "event1.jpg"}
            alt={event.title}
            className="img-fluid rounded mb-4 shadow-sm"
            onError={(e) => {
              e.target.src = 'event1.jpg';
            }}
          />
          <h4 className="fw-bold">{event.title}</h4>
          <p className="fw-semibold mt-2 mb-1">Date: {event.date}</p>
          <p className="fw-semibold mb-1">Time: {event.time}</p>
          <p className="fw-semibold mb-1">Location: {event.location}</p>
          <p className="text-secondary">{event.description}</p>
          <p className="fw-bold">
            Available Tickets: {event.availableTickets} / {event.capacity}
          </p>
          <p className="fw-bold text-primary">
            Price: Rp {event.price.toLocaleString('id-ID')}
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
                max={event.availableTickets}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>

            {selectedTicket && (
              <div className="alert alert-info">
                <strong>Total:</strong> Rp {calculateTotal().toLocaleString('id-ID')}
              </div>
            )}

            <button
              type="submit"
              className="btn-buy"
              disabled={!selectedTicket || processing || event.availableTickets === 0}
            >
              {processing 
                ? "Processing..." 
                : event.availableTickets === 0 
                  ? "Sold Out"
                  : selectedTicket 
                    ? `Buy ${selectedTicket.toUpperCase()} Ticket` 
                    : "Choose Ticket Type"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;