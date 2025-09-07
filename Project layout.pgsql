cafe-fausse/
├─ backend/
│  ├─ venv/ (your virtualenv)
│  ├─ app.py              # Flask app + route wiring
│  ├─ models.py           # SQLAlchemy models
│  ├─ forms.py            # server-side validation functions (separate file)
│  ├─ db_init.py          # optional helper to (re)create DB using raw SQL
│  ├─ requirements.txt
│  └─ static_images/      # (optional) images for API to serve
├─ frontend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ App.js
│  │  ├─ index.js
│  │  ├─ pages/
│  │  │  ├─ Home.js
│  │  │  ├─ Menu.js
│  │  │  ├─ Reservations.js   # React form page
│  │  │  ├─ About.js
│  │  │  └─ Gallery.js
│  │  └─ components/
│  │     └─ ReservationForm.js
│  └─ public/
└─ README.md
