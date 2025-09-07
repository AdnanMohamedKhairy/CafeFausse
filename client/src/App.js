import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import About from "./pages/About";
import Gallery from "./pages/Gallery";

import AdminLayout from "./components/AdminLayout";
import Admin from "./pages/Admin";
import AdminNewsletter from "./pages/AdminNewsletter";


import DarkModeToggle from "./components/DarkModeToggle";


export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        {/* <div className="brand">Café Fausse</div> */}
        <div className="brand"><Link to="/">Café Fausse</Link></div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="site-main">
        <DarkModeToggle />  
        <Routes>
     
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />   {/* <-- new admin route */}
          {/* // inside <Routes> */}
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          {/* Admin pages with separate layout */}
          
          <Route index element={<Admin />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          </Route>

        </Routes>
      </main>

      <footer className="site-footer">
        <div>© {new Date().getFullYear()} Café Fausse — 123 Example St.</div>
      </footer>
    </div>
  );
}
