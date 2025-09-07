import React, { useState } from "react";

/*
  This component uses the backend endpoint POST /api/reservations
  Expected JSON fields:
  { name, email, phone (optional), time_slot (ISO), party_size }
*/

export default function ReservationForm(){
  const [form, setForm] = useState({
    name: "", email: "", phone: "", time_slot: "", party_size: 2
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  function clientValidate(){
    if(!form.name || form.name.trim().length < 2) return "Name must be at least 2 characters.";
    const emailRe = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if(!emailRe.test(form.email)) return "Valid email required.";
    if(!form.time_slot) return "Please choose a time.";
    if(!form.party_size || form.party_size < 1 || form.party_size > 12) return "Party size 1–12.";
    return null;
  }

  async function onSubmit(e){
    e.preventDefault();
    setMessage(null);
    const v = clientValidate();
    if(v){ setMessage({type:"error", text:v}); return; }
    setBusy(true);
    try {
      // datetime-local inputs produce a value like "2025-09-10T19:00"
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Server error");
      setMessage({type:"success", text: data.message || "Reservation confirmed!"});
      // reset small part
      setForm(prev => ({...prev, name: "", email: "", phone: "", time_slot: "", party_size: 2}));
    } catch (err) {
      setMessage({type:"error", text: err.message});
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <label>
        Name
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
      </label>
      <label>
        Phone (optional)
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
      </label>
      <label>
        Time slot
        <input type="datetime-local" value={form.time_slot} onChange={e=>setForm({...form, time_slot:e.target.value})} required />
      </label>
      <label>
        Party size
        <input type="number" min="1" max="12" value={form.party_size}
               onChange={e=>setForm({...form, party_size: parseInt(e.target.value || 1)})} />
      </label>

      <button type="submit" disabled={busy}>{busy? "Booking…" : "Book Table"}</button>

      {message && (
        <div className={`message ${message.type === "success" ? "success" : "error"}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}







// put this inside your ReservationForm component
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;

  // IMPORTANT: input names must be exactly these:
  // name, email, phone, time_slot, party_size
  const nameEl       = form.elements.namedItem("name");
  const emailEl      = form.elements.namedItem("email");
  const phoneEl      = form.elements.namedItem("phone");
  const timeSlotEl   = form.elements.namedItem("time_slot");
  const partySizeEl  = form.elements.namedItem("party_size");

  // 1) Clear any previous custom validity messages (so browser tooltip resets)
  [nameEl, emailEl, phoneEl, timeSlotEl, partySizeEl].forEach(el => el && el.setCustomValidity(""));

  // 2) Let the browser do its built-in validation first (required, type=email, min/max)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // 3) Build payload from form values (does not change your JSX)
  const payload = {
    name: nameEl?.value?.trim() || "",
    email: emailEl?.value?.trim() || "",
    phone: phoneEl?.value?.trim() || "",
    time_slot: timeSlotEl?.value || "",
    party_size: Number(partySizeEl?.value || 0),
  };

  try {
    const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : { success: false, error: await res.text() };

    // 4) Success → reset form and show native confirmation (no extra DOM)
    if (res.ok && data.success) {
      form.reset();
      // Use a native dialog to avoid injecting any markup/styles
      window.alert(data.message || "Reservation confirmed!");
      return;
    }

    // 5) Server-side errors → map to the correct field & use native tooltip via setCustomValidity
    // If backend returns a field error dict like: {"errors": {"email": ["Invalid email"]}}
    if (data && data.errors && typeof data.errors === "object") {
      if (data.errors.name?.[0])        nameEl.setCustomValidity(data.errors.name[0]);
      if (data.errors.email?.[0])       emailEl.setCustomValidity(data.errors.email[0]);
      if (data.errors.phone?.[0])       phoneEl.setCustomValidity(data.errors.phone[0]);
      if (data.errors.time_slot?.[0])   timeSlotEl.setCustomValidity(data.errors.time_slot[0]);
      if (data.errors.party_size?.[0])  partySizeEl.setCustomValidity(data.errors.party_size[0]);
      form.reportValidity();
      return;
    }

    // If backend returns a single message (your app.py does this):
    // e.g. "This time slot is fully booked..." or "Invalid email"
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    if (/time slot|fully booked|No tables available/i.test(msg)) {
      timeSlotEl.setCustomValidity(msg);
    } else if (/email/i.test(msg)) {
      emailEl.setCustomValidity(msg);
    } else if (/name/i.test(msg)) {
      nameEl.setCustomValidity(msg);
    } else if (/party/i.test(msg)) {
      partySizeEl.setCustomValidity(msg);
    } else if (/phone/i.test(msg)) {
      phoneEl.setCustomValidity(msg);
    } else {
      // Unknown/global error → show native alert so we don't touch layout/styles
      window.alert(msg);
      return;
    }
    form.reportValidity();

  } catch (err) {
    // Network or unexpected error → native alert (no DOM changes)
    window.alert("Network error: " + (err?.message || String(err)));
  }
}
