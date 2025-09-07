import React, { useEffect, useState } from "react";

import DarkModeToggle from "../components/DarkModeToggle";

export default function Menu(){
  const [menu, setMenu] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(()=>{
    fetch("http://localhost:5000/api/menu")
      .then(r=>r.json())
      .then(data=>setMenu(data))
      .catch(e=>setErr("Couldn't load menu"));
  },[]);

  if(err) return <div className="menu-section">{err}</div>;
  if(!menu) return <div className="menu-section">Loading menu…</div>;

  return (
    <div>
      <h2>Menu</h2>
      <div className="grid">
        {Object.keys(menu).map(cat => (
          <div key={cat} className="menu-section">
            <h3>{cat}</h3>
            <ul>
              {menu[cat].map((item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong> — ${item.price.toFixed(2)}
                </li>
                
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
