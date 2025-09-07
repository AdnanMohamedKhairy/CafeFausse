# backend/seed_db.py
from datetime import datetime, timedelta
from models import SessionLocal, Customer, Reservation
import random

def seed():
    session = SessionLocal()

    # Clear existing data
    session.query(Reservation).delete()
    session.query(Customer).delete()
    session.commit()

    # Create some customers
    customers = [
        Customer(name="Alice Johnson", email="alice@example.com", phone="111-111-1111", newsletter=True),
        Customer(name="Bob Smith", email="bob@example.com", phone="222-222-2222", newsletter=False),
        Customer(name="Charlie Brown", email="charlie@example.com", phone="333-333-3333", newsletter=True),
        Customer(name="Diana Prince", email="diana@example.com", phone="444-444-4444", newsletter=False),
        Customer(name="Ethan Hunt", email="ethan@example.com", phone="555-555-5555", newsletter=True),
        Customer(name="Fiona Apple", email="fiona@example.com", phone="666-666-6666", newsletter=False),
    ]
    session.add_all(customers)
    session.commit()

    # normalize to today 19:00, local time
    base_time = datetime.now().replace(hour=19, minute=0, second=0, microsecond=0)

    # Hour 1 (19:00) → fully booked (10 tables)
    for table in range(1, 11):
        cust = random.choice(customers)
        res = Reservation(
            customer_id=cust.id,
            time_slot=base_time,
            table_number=table,
            party_size=random.randint(1, 6),
        )
        session.add(res)

    # Hour 2 (20:00) → 3 reservations
    for table in range(1, 4):
        cust = random.choice(customers)
        res = Reservation(
            customer_id=cust.id,
            time_slot=base_time + timedelta(hours=1),
            table_number=table,
            party_size=random.randint(1, 6),
        )
        session.add(res)

    # Hour 3 (21:00) → random 5 reservations
    random_tables = random.sample(range(1, 11), k=5)
    for table in random_tables:
        cust = random.choice(customers)
        res = Reservation(
            customer_id=cust.id,
            time_slot=base_time + timedelta(hours=2),
            table_number=table,
            party_size=random.randint(1, 6),
        )
        session.add(res)

    session.commit()
    session.close()
    print("✅ Database seeded with demo customers and reservations.")


if __name__ == "__main__":
    seed()
