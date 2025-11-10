import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/user/Home";
import Event from "./pages/user/Event";
import EventDetail from "./pages/user/EventDetail";
import MyTickets from "./pages/user/MyTickets";

function AppContent() {
  const location = useLocation();

  // Halaman yang tidak menampilkan navbar & footer
  const hideLayout = ["/SignIn", "/SignUp"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Event" element={<Event />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/EventDetail" element={<EventDetail />} />
        <Route path="/MyTickets" element={<MyTickets />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;