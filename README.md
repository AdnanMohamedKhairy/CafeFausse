# Café Fausse – Restaurant Web Application

**Author:** Adnan Mohamed  
**Course / Project:** MSSE Web Application & Interface Design

---

## 📖 Overview

Café Fausse is a full-stack restaurant web application built with **Flask** (backend) and **React** (frontend).  
It allows customers to view the menu, make reservations, and sign up for a newsletter.  
Admins can manage reservations and newsletter subscribers through a dedicated dashboard.  

The site is fully **responsive** and includes a **dark mode toggle**.

---

## 🚀 Features

### Public Website
- **Menu Display** – Dynamic menu categories and prices (fetched from Flask backend).  
- **Reservations System** – Customers can book tables with validation and hourly capacity (10 tables per hour).  
- **Newsletter Signup** – Subscribe with email validation.  
- **Gallery** – Interactive image gallery with fullscreen preview.  
- **Dark Mode** – Toggle between light/dark themes, preference saved to local storage.  
- **Responsive Design** – Works on desktop, tablet, and mobile devices.  

### Admin Dashboard
- **Reservations Management** – View reservations with filtering, sorting, and pagination.  
- **Newsletter Subscribers** – View list of newsletter signups.  
- **Export Data** – Export reservations as CSV/Excel.  
- **Separate Admin Navigation** – Independent sidebar navigation for admin pages.  

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router, Fetch API, CSS (custom responsive design + dark mode)  
- **Backend:** Flask (Python), Flask-CORS  
- **Database:** SQLite + SQLAlchemy ORM  
- **Validation:** Custom validation helpers (forms.py) + server-side checks  

---

## 📂 Project Structure




CafeFausse/
├── backend/
│ ├── app.py # Flask backend (routes)
│ ├── models.py # SQLAlchemy models
│ ├── forms.py # Input validation helpers
│ ├── db_init.py # Database setup
│ └── seed_db.py # Seeds database with sample data
├── client/
│ ├── src/
│ │ ├── pages/ # React pages (Menu, Gallery, Reservations, Admin, Newsletter)
│ │ ├── components/ # Shared components (DarkModeToggle, AdminLayout, forms)
│ │ └── App.js
│ └── package.json
├── docs/
│ └── screenshots/ # Screenshots for documentation
├── README.md
└── requirements.txt




---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/AdnanMohamedKhairy/CafeFausse.git
cd CafeFausse




---



## Backend
cd backend
python -m venv venv
# Activate virtualenv
# On macOS/Linux:
source venv/bin/activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

pip install -r ../requirements.txt
python app.py

Backend runs at http://localhost:5000


## Frontend (React)
cd client
npm install
npm start

Frontend runs at http://localhost:3000



| Requirement                         | Implemented In                                 |
| ----------------------------------- | ---------------------------------------------- |
| Display menu                        | `/api/menu` + `client/src/pages/Menu.js`       |
| Accept reservations with validation | `/api/reservations` + `ReservationForm.js`     |
| Handle 10 tables/hour limit         | Reservation logic in `app.py`                  |
| Newsletter signup                   | `/api/newsletter` + `NewsletterForm.js`        |
| Admin view reservations             | `/api/admin/reservations` + `Admin.js`         |
| Admin view subscribers              | `/api/admin/newsletter` + `AdminNewsletter.js` |
| Responsive design                   | `index.css` + media queries                    |
| Bonus: Dark mode                    | `DarkModeToggle.js`                            |
| Bonus: Export CSV                   | Admin dashboard                                |










Testing

Start backend (python app.py) and frontend (npm start).

Visit http://localhost:3000.

Test cases:

Reservation system: Make more than 10 bookings in the same hour → last one should be rejected.

Validation: Try invalid email, empty name, negative party size.

Admin: Confirm reservations appear, filters and pagination work.

Dark mode: Toggle between themes and reload (preference persists).

Responsive design: Open DevTools → Mobile view (iPhone/Pixel) and confirm layout works.