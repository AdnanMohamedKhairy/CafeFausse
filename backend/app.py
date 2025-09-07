from flask import Flask, request, jsonify
from flask_cors import CORS
from models import engine, SessionLocal, Base, Customer, Reservation
from db_init import create_tables_sql
from forms import (
    validate_email,
    validate_name,
    validate_phone,
    validate_party_size,
    validate_time_slot,
)
from sqlalchemy import func, asc, desc
import random
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

# Ensure SQL tables exist
create_tables_sql()
Base.metadata.create_all(bind=engine)

# Tables per hour slot
MAX_TABLES_PER_HOUR = 10


# ----------------------------
# Routes
# ----------------------------

@app.route("/api/menu")
def menu():
    menu_data = {
        "Starters": [
            {"name": "Bruschetta", "price": 8.5},
            {"name": "Caesar Salad", "price": 9.0},
        ],
        "Mains": [
            {"name": "Grilled Salmon", "price": 22.0},
            {"name": "Ribeye Steak", "price": 28.0},
            {"name": "Vegetable Risotto", "price": 18.0},
        ],
        "Desserts": [
            {"name": "Tiramisu", "price": 7.5},
            {"name": "Cheesecake", "price": 7.0},
        ],
        "Beverages": [
            {"name": "Red Wine (Glass)", "price": 10.0},
            {"name": "White Wine (Glass)", "price": 9.0},
            {"name": "Craft Beer", "price": 6.0},
            {"name": "Espresso", "price": 3.0},
        ],
    }
    return jsonify(menu_data)


@app.route("/api/newsletter", methods=["POST"])
def newsletter_signup():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    name = data.get("name", "").strip() if data.get("name") else None

    ok, err = validate_email(email)
    if not ok:
        return jsonify({"success": False, "error": err}), 400

    session = SessionLocal()
    try:
        # upsert customer by email
        customer = session.query(Customer).filter(Customer.email == email).first()
        if not customer:
            customer = Customer(
                name=name or "Guest", email=email, newsletter=True
            )
            session.add(customer)
        else:
            customer.newsletter = True
            if name:
                customer.name = name

        session.commit()

        # serialize before closing
        cust_data = {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "newsletter": customer.newsletter,
        }

        return jsonify(
            {"success": True, "message": "Signed up for newsletter.", "customer": cust_data}
        ), 201
    except Exception as e:
        session.rollback()
        print("Error in /api/newsletter:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        session.close()


@app.route("/api/reservations", methods=["POST"])
def make_reservation():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip() if data.get("phone") else None
    ts_str = data.get("time_slot", "")
    party_size = data.get("party_size")

    # validations
    ok, err = validate_name(name)
    if not ok: return jsonify({"success": False, "error": err}), 400
    ok, err = validate_email(email)
    if not ok: return jsonify({"success": False, "error": err}), 400
    ok, err = validate_phone(phone)
    if not ok: return jsonify({"success": False, "error": err}), 400
    ok, err = validate_party_size(party_size)
    if not ok: return jsonify({"success": False, "error": err}), 400
    ok, err, ts_parsed = validate_time_slot(ts_str)


    if not ok:
        return jsonify({"success": False, "error": err}), 400

    # ✅ normalize to the top of the hour
    ts_parsed = ts_parsed.replace(minute=0, second=0, microsecond=0)
    



    if not ok: return jsonify({"success": False, "error": err}), 400

    # ✅ normalize to the start of the hour
    ts_parsed = ts_parsed.replace(minute=0, second=0, microsecond=0)

    session = SessionLocal()
    try:
        # find or create customer
        customer = session.query(Customer).filter(Customer.email == email).first()
        if not customer:
            customer = Customer(
                name=name, email=email, phone=phone, newsletter=False
            )
            session.add(customer)
            session.commit()  # generate id

        # capacity check (10 tables per hour)
        existing_count = (
            session.query(func.count(Reservation.id))
            .filter(Reservation.time_slot == ts_parsed)
            .scalar()
        )
        if existing_count >= MAX_TABLES:
            wait_entry = Waitlist(customer_id=customer.id, time_slot=ts_parsed)
            session.add(wait_entry)
        session.commit()
        return (
            jsonify({
                "success": False,
                "error": "This hour is fully booked. You’ve been added to the waitlist.",
                "waitlist": True
            }),
            202,
        )


        # pick a free table
        occupied_tables = (
            session.query(Reservation.table_number)
            .filter(Reservation.time_slot == ts_parsed)
            .all()
        )
        occupied_set = {t[0] for t in occupied_tables}
        free_tables = [
            t for t in range(1, MAX_TABLES_PER_HOUR + 1) if t not in occupied_set
        ]
        if not free_tables:
            return jsonify({"success": False, "error": "No tables available."}), 409

        table_num = random.choice(free_tables)
        reservation = Reservation(
            customer_id=customer.id,
            time_slot=ts_parsed,
            table_number=table_num,
            party_size=int(party_size),
        )
        session.add(reservation)
        session.commit()

        # ✅ send confirmation email here
        send_email(
            email,
            "Your Reservation Confirmation",
            f"Hello {name}, your reservation at Cafe Fausse is confirmed for "
            f"{ts_parsed.strftime('%Y-%m-%d %H:%M')} at table {table_num}."
        )
        # serialize before closing session
        res_data = {
            "id": reservation.id,
            "table_number": reservation.table_number,
            "time_slot": reservation.time_slot.isoformat(),
            "party_size": reservation.party_size,
            "customer": {
                "id": customer.id,
                "name": customer.name,
                "email": customer.email,
            },
        } 




        return (
            jsonify(
                {
                    "success": True,
                    "message": "Reservation confirmed",
                    "reservation": res_data,
                }
            ),
            201,
        )
    except Exception as e:
        session.rollback()
        print("Error in /api/reservations:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        session.close()



@app.route("/api/admin/reservations", methods=["GET"])
def admin_reservations():
    token = request.args.get("token")
    if token != "secret123":  # change for production
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    session = SessionLocal()
    try:
        # Base query (join Customer so we can filter by name)
        query = session.query(Reservation).join(Customer)

        # ---------- Filters ----------
        date = request.args.get("date")        # expect "YYYY-MM-DD"
        customer_q = request.args.get("customer")  # substring match
        table_q = request.args.get("table")    # integer

        if date:
            # SQLite: func.date works; other DBs too
            query = query.filter(func.date(Reservation.time_slot) == date)
        if customer_q:
            query = query.filter(Customer.name.ilike(f"%{customer_q}%"))
        if table_q:
            try:
                table_num = int(table_q)
                query = query.filter(Reservation.table_number == table_num)
            except ValueError:
                pass

        # ---------- Sorting ----------
        sort_by = request.args.get("sort_by", "time")    # 'time' or 'table'
        sort_order = request.args.get("sort_order", "asc").lower()  # 'asc' or 'desc'
        order_func = asc if sort_order == "asc" else desc

        if sort_by == "table":
            query = query.order_by(order_func(Reservation.table_number))
        else:
            # default sort by time
            query = query.order_by(order_func(Reservation.time_slot))

        # ---------- Total count (before pagination) ----------
        try:
            total = int(query.count())
        except Exception:
            total = 0

        # ---------- Pagination ----------
        try:
            page = max(1, int(request.args.get("page", 1)))
        except Exception:
            page = 1
        try:
            per_page = max(1, int(request.args.get("per_page", 10)))
        except Exception:
            per_page = 10

        # fetch page
        reservations = query.offset((page - 1) * per_page).limit(per_page).all()

        # ---------- Build JSON output ----------
        output = []
        for r in reservations:
            # use r.customer if relationship is configured; otherwise fetch
            customer = None
            try:
                customer = r.customer
            except Exception:
                customer = session.query(Customer).filter_by(id=r.customer_id).first()

            output.append({
                "id": r.id,
                "time_slot": r.time_slot.isoformat(),
                "table_number": r.table_number,
                "party_size": r.party_size,
                "customer": {
                    "id": customer.id if customer else None,
                    "name": customer.name if customer else None,
                    "email": customer.email if customer else None,
                }
            })

        return jsonify({
            "success": True,
            "reservations": output,
            "page": page,
            "per_page": per_page,
            "total": total
        }), 200

    except Exception as e:
        print("Error in /api/admin/reservations:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        session.close()

# backend newsletter


@app.route("/api/admin/newsletter", methods=["GET"])
def admin_newsletter():
    token = request.args.get("token")
    if token != "secret123":  # secure later
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    session = SessionLocal()
    try:
        customers = session.query(Customer).filter(Customer.newsletter == True).all()

        output = []
        for c in customers:
            output.append({
                "id": c.id,
                "name": c.name,
                "email": c.email,
                "phone": c.phone,
                "newsletter": c.newsletter
            })

        return jsonify({"success": True, "subscribers": output}), 200
    except Exception as e:
        print("Error in /api/admin/newsletter:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        session.close()



# email noti

app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME="adnan291089@gmail.com",
    MAIL_PASSWORD="PASSWORD"  # or app password
)
mail = Mail(app)

def send_email(to, subject, body):
    try:
        msg = Message(subject, recipients=[to], body=body, sender=app.config["MAIL_USERNAME"])
        mail.send(msg)
    except Exception as e:
        print("Email error:", e)















@app.route("/api/admin/waitlist", methods=["GET"])
def admin_waitlist():
    token = request.args.get("token")
    if token != "secret123":
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    session = SessionLocal()
    try:
        waitlist = session.query(Waitlist).all()
        output = []
        for w in waitlist:
            output.append({
                "id": w.id,
                "time_slot": w.time_slot.isoformat(),
                "customer": {
                    "id": w.customer.id,
                    "name": w.customer.name,
                    "email": w.customer.email,
                }
            })
        return jsonify({"success": True, "waitlist": output}), 200
    finally:
        session.close()


# ----------------------------
# Run
# ----------------------------

if __name__ == "__main__":
    app.run(debug=True)


