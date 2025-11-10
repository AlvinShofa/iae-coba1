import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTickets } from "../../services/ticketService";

export default function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      const username = localStorage.getItem("username");
      
      if (!username) {
        navigate("/SignIn");
        return;
      }

      setLoading(true);
      const response = await getUserTickets(username);

      if (response.success) {
        setTickets(response.tickets || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      paid: 'bg-success',
      used: 'bg-secondary',
      cancelled: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Tickets</h2>

      {tickets.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">You don't have any tickets yet.</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => navigate("/event")}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <img 
                  src={ticket.event.imageUrl || 'event1.jpg'} 
                  className="card-img-top" 
                  alt={ticket.event.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'event1.jpg';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{ticket.event.title}</h5>
                  <p className="card-text text-muted small">
                    {ticket.event.date} • {ticket.event.time}
                  </p>
                  <p className="card-text text-muted small mb-1">
                    {ticket.event.location}
                  </p>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Ticket Code:</span>
                    <strong className="text-primary">{ticket.ticketCode}</strong>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Quantity:</span>
                    <strong>{ticket.quantity}x</strong>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Total:</span>
                    <strong className="text-success">
                      Rp {ticket.totalPrice.toLocaleString('id-ID')}
                    </strong>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Status:</span>
                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-muted small mt-2 mb-0">
                    Purchased: {new Date(ticket.purchaseDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                
                {ticket.status === 'paid' && (
                  <div className="card-footer bg-white">
                    <button className="btn btn-sm btn-outline-primary w-100">
                      Download E-Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}