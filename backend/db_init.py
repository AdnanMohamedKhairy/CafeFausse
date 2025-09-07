# backend/db_init.py
from models import engine, CREATE_CUSTOMERS_SQL, CREATE_RESERVATIONS_SQL
from sqlalchemy import text

def create_tables_sql():
    with engine.connect() as conn:
        conn.execute(text(CREATE_CUSTOMERS_SQL))
        conn.execute(text(CREATE_RESERVATIONS_SQL))
        conn.commit()

if __name__ == "__main__":
    create_tables_sql()
    print("Tables created (raw SQL executed).")
