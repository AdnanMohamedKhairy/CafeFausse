

import React from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = React.useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  React.useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
