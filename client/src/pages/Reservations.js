import React from "react";
import ReservationForm from "../components/ReservationForm";

export default function Reservations(){
  return (
    <div>
      <h2>Reservations</h2>
      <p>Reserve a table up to 30 tables per time slot. Fill the form below.</p>
      <div style={{maxWidth:560}}>
        <ReservationForm />
      </div>
    </div>
  );
}
