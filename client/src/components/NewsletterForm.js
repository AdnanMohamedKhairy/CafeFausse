import React, { useState } from "react";

export default function NewsletterForm(){
  const [form, setForm] = useState({ name: "", email: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate(){
    if(!form.email) return "Email required.";
    const emailRe = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if(!emailRe.test(form.email)) return "Enter a valid email.";
    return null;
  }

  async function onSubmit(e){
    e.preventDefault();
    setMsg(null);
    const v = validate();
    if(v) { setMsg({type:"error", text:v}); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Sign up failed");
      setMsg({type:"success", text: data.message || "Thanks for signing up!"});
      setForm({ name: "", email: "" });
    } catch (err) {
      setMsg({type:"error", text: err.message});
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name (optional)
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      </label>
      <label>
        Email
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
      </label>
      <button type="submit" disabled={loading}>{loading ? "Signing…" : "Sign up"}</button>
      {msg && <div className={`message ${msg.type === "success" ? "success" : "error"}`}>{msg.text}</div>}
    </form>
  );
}
