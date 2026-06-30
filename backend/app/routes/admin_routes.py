from datetime import datetime
from functools import wraps

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

try:
    from ..core.settings import ADMIN_CREDENTIALS
    from ..db.mongo import farmers, market_farmers, market_merchants
    from ..utils.validators import validate_email, validate_farmer_id, validate_mobile
except ImportError:
    from core.settings import ADMIN_CREDENTIALS
    from db.mongo import farmers, market_farmers, market_merchants
    from utils.validators import validate_email, validate_farmer_id, validate_mobile


admin_bp = Blueprint("admin", __name__)


def _verify_admin(admin_id: str, password: str) -> bool:
    if not admin_id or not password:
        return False
    expected = ADMIN_CREDENTIALS.get(admin_id.strip())
    return expected is not None and expected == password


def require_admin(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        admin_id = request.headers.get("X-Admin-Id", "").strip()
        admin_pass = request.headers.get("X-Admin-Password", "")
        if not _verify_admin(admin_id, admin_pass):
            return jsonify({"error": "Unauthorized admin access"}), 401
        return view(*args, **kwargs)

    return wrapped


@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    body = request.json or {}
    admin_id = body.get("adminId", "").strip()
    password = body.get("password", "")

    if not _verify_admin(admin_id, password):
        return jsonify({"error": "Invalid admin credentials"}), 401

    return (
        jsonify(
            {
                "status": "Admin login successful",
                "adminId": admin_id,
                "role": "admin",
            }
        ),
        200,
    )


@admin_bp.route("/admin/users", methods=["GET"])
@require_admin
def list_users():
    all_farmers = list(farmers.find({}, {"_id": 0, "password": 0}))
    return jsonify({"users": all_farmers, "count": len(all_farmers)}), 200


@admin_bp.route("/admin/users", methods=["POST"])
@require_admin
def add_user():
    body = request.json or {}
    required = ["farmerId", "userName", "email", "mobile", "state", "password"]
    missing = [f for f in required if not body.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    farmer_id = body["farmerId"].strip()
    if not validate_farmer_id(farmer_id):
        return jsonify({"error": "Invalid farmer ID format"}), 400
    if farmers.find_one({"farmerId": farmer_id}):
        return jsonify({"error": "Farmer ID already exists"}), 409

    email = body["email"].strip().lower()
    if not validate_email(email):
        return jsonify({"error": "Invalid email"}), 400
    if farmers.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    mobile = str(body["mobile"]).strip()
    if not validate_mobile(mobile):
        return jsonify({"error": "Invalid mobile number"}), 400

    doc = {
        "farmerId": farmer_id,
        "userName": body["userName"].strip(),
        "email": email,
        "mobile": mobile,
        "state": body["state"].strip(),
        "landSize": body.get("landSize", ""),
        "cropType": body.get("cropType", "").strip(),
        "password": generate_password_hash(body["password"]),
        "createdAt": datetime.utcnow().isoformat(),
    }
    farmers.insert_one(doc)
    doc.pop("password", None)
    return jsonify({"status": "User added", "user": doc}), 201


@admin_bp.route("/admin/users/<farmer_id>", methods=["DELETE"])
@require_admin
def delete_user(farmer_id):
    result = farmers.delete_one({"farmerId": farmer_id.strip()})
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"status": "User removed", "farmerId": farmer_id}), 200


@admin_bp.route("/admin/market/farmers", methods=["GET"])
@require_admin
def list_market_farmers():
    data = list(market_farmers.find({}, {"_id": 0}))
    return jsonify({"items": data, "count": len(data)}), 200


@admin_bp.route("/admin/market/merchants", methods=["GET"])
@require_admin
def list_market_merchants():
    data = list(market_merchants.find({}, {"_id": 0}))
    return jsonify({"items": data, "count": len(data)}), 200


@admin_bp.route("/admin/market/farmer", methods=["POST"])
@require_admin
def add_market_farmer():
    body = request.json or {}
    name = body.get("Name")
    if not name:
        return jsonify({"error": "Missing 'Name' field"}), 400
    doc = {
        "Name": name,
        "farmerId": body.get("farmerId"),
        "contact": body.get("contact"),
        "emailId": body.get("emailId"),
        "product": body.get("product"),
        "quantity": body.get("quantity"),
        "price": body.get("price"),
    }
    market_farmers.insert_one(doc)
    doc.pop("_id", None)
    return jsonify({"status": "Farmer listing added", "item": doc}), 201


@admin_bp.route("/admin/market/farmer", methods=["DELETE"])
@require_admin
def delete_market_farmer():
    body = request.json or {}
    query = {}
    for key in ("farmerId", "Name", "emailId", "contact", "product"):
        if body.get(key):
            query[key] = body[key]

    if not query:
        return jsonify({"error": "Provide at least one field to identify the listing"}), 400

    result = market_farmers.delete_one(query)
    if result.deleted_count == 0:
        return jsonify({"error": "Farmer marketplace entry not found"}), 404
    return jsonify({"status": "Marketplace farmer entry removed"}), 200


@admin_bp.route("/admin/market/merchant", methods=["POST"])
@require_admin
def add_market_merchant():
    body = request.json or {}
    name = body.get("Name")
    if not name:
        return jsonify({"error": "Missing 'Name' field"}), 400
    doc = {
        "Name": name,
        "merchantId": body.get("merchantId"),
        "contact": body.get("contact"),
        "emailId": body.get("emailId"),
        "product": body.get("product"),
        "quantity": body.get("quantity"),
        "price": body.get("price"),
    }
    market_merchants.insert_one(doc)
    doc.pop("_id", None)
    return jsonify({"status": "Merchant listing added", "item": doc}), 201


@admin_bp.route("/admin/market/merchant", methods=["DELETE"])
@require_admin
def delete_market_merchant():
    body = request.json or {}
    query = {}
    for key in ("merchantId", "Name", "emailId", "contact", "product"):
        if body.get(key):
            query[key] = body[key]

    if not query:
        return jsonify({"error": "Provide at least one field to identify the listing"}), 400

    result = market_merchants.delete_one(query)
    if result.deleted_count == 0:
        return jsonify({"error": "Merchant marketplace entry not found"}), 404
    return jsonify({"status": "Marketplace merchant entry removed"}), 200
