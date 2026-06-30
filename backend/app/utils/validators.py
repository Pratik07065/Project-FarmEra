import re


def validate_farmer_id(fid):
    return bool(re.match(r"^[A-Za-z0-9]{4,15}$", fid))


def validate_email(email):
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def validate_mobile(mobile):
    return bool(re.match(r"^[6-9]\d{9}$", str(mobile)))
