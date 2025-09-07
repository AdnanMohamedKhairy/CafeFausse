# backend/forms.py
import re
from datetime import datetime

EMAIL_RE = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")
PHONE_RE = re.compile(r"^[\d\-\+\s\(\)]{7,20}$")

def validate_email(email: str) -> (bool, str):
    if not email:
        return False, "Email is required."
    if not EMAIL_RE.match(email):
        return False, "Invalid email format."
    return True, ""

def validate_name(name: str) -> (bool, str):
    if not name or len(name.strip()) < 2:
        return False, "Name must be at least 2 characters."
    return True, ""

def validate_phone(phone: str) -> (bool, str):
    if not phone:
        return True, ""  # phone optional
    if not PHONE_RE.match(phone):
        return False, "Invalid phone number."
    return True, ""

def validate_party_size(party_size: int) -> (bool, str):
    try:
        n = int(party_size)
    except Exception:
        return False, "Party size must be a number."
    if n < 1 or n > 12:
        return False, "Party size must be between 1 and 12."
    return True, ""

def validate_time_slot(ts: str) -> (bool, str, datetime):
    # Expect ISO format like 2025-09-10T19:00
    try:
        parsed = datetime.fromisoformat(ts)
    except Exception:
        return False, "Time slot must be ISO datetime (YYYY-MM-DDTHH:MM).", None
    if parsed < datetime.now():
        return False, "Time slot must be in the future.", None
    return True, "", parsed
