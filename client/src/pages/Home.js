import React from "react";
import NewsletterForm from "../components/NewsletterForm";

export default function Home(){
  return (
    <div>
      <div className="page-hero">
        <div className="hero-card">
          <h1>Welcome to Café Fausse</h1>
          <p>
            A cozy place for modern classics. Reserve a table, check our menu, or sign up for the newsletter for special events.
          </p>
          <ul>
            <li>Hours: Mon–Sun 08:00–22:00</li>
            <li>Address: 123 Example St., Your City</li>
            <li>Phone: +1 (555) 555-5555</li>
          </ul>
        </div>

        <div>
          <img src="/gallery-cafe-interior.webp" alt="interior" className="hero-image" />
          <div style={{marginTop:12}} className="form-card">
            <h3>Join our newsletter</h3>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <section className="grid cols-3">
        <div className="menu-section">
          <h3>Chef's Specials</h3>
          <p>Ask about seasonal menus and tasting events.</p>
        </div>
        <div className="menu-section">
          <h3>Private Events</h3>
          <p>We host private dinners and events; contact us to plan.</p>
        </div>
        <div className="menu-section">
          <h3>Gift Cards</h3>
          <p>Gift cards available in-store.</p>
        </div>
      </section>
    </div>
  );
}
