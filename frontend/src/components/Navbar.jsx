import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) setIsLoggedIn(true);
}, []);

 const handleLogout = () => {
  // 1️⃣ Hapus data login
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("token"); // jika ada

  // 2️⃣ Update state agar Navbar rerender
  setIsLoggedIn(false);

  // 3️⃣ Redirect ke halaman Sign In
  navigate("/SignIn");
};


  return (
    <Navbar expand="lg" className="py-3 bg-white shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          TICKET.ID
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-center">
          <Nav className="gap-4">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/Event">Event</Nav.Link>
            <Nav.Link as={Link} to="/MyTickets">My Tickets</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex gap-2">
          {!isLoggedIn ? (
            <>
              <Button as={Link} to="/SignIn" variant="outline-dark" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/SignUp" variant="secondary" size="sm">
                Sign Up
              </Button>
            </>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-profile"
                style={{
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}
              >
                <Image
                  src="https://via.placeholder.com/40?text=U"
                  roundedCircle
                  width="40"
                  height="40"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
