from datetime import datetime

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

try:
    from ..db.mongo import farmers, market_farmers, market_merchants
    from ..utils.validators import validate_email, validate_farmer_id, validate_mobile
except ImportError:
    from db.mongo import farmers, market_farmers, market_merchants
    from utils.validators import validate_email, validate_farmer_id, validate_mobile


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/farmer/register", methods=["POST"])
def register():
    body = request.json or {}
    required = ["farmerId", "userName", "email", "mobile", "state", "password"]
    missing = [f for f in required if not body.get(f)]

    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    farmer_id = body["farmerId"].strip()
    user_name = body["userName"].strip()
    email = body["email"].strip().lower()
    mobile = str(body["mobile"]).strip()
    state = body["state"].strip()
    password = body["password"]
    land_size = body.get("landSize", "")
    crop_type = body.get("cropType", "").strip()

    if not validate_farmer_id(farmer_id):
        return jsonify({"error": "Farmer ID must be 4–15 alphanumeric characters"}), 400
    if len(user_name) < 3:
        return jsonify({"error": "Name must be at least 3 characters"}), 400
    if not validate_email(email):
        return jsonify({"error": "Invalid email address"}), 400
    if not validate_mobile(mobile):
        return jsonify({"error": "Enter a valid 10-digit Indian mobile number"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    if farmers.find_one({"farmerId": farmer_id}):
        return jsonify({"error": "Farmer ID already exists. Please choose another."}), 409
    if farmers.find_one({"email": email}):
        return jsonify({"error": "Email is already registered."}), 409

    hashed_pwd = generate_password_hash(password)
    doc = {
        "farmerId": farmer_id,
        "userName": user_name,
        "email": email,
        "mobile": mobile,
        "state": state,
        "landSize": land_size,
        "cropType": crop_type,
        "password": hashed_pwd,
        "createdAt": datetime.utcnow().isoformat(),
    }
    farmers.insert_one(doc)

    return (
        jsonify(
            {
                "status": "Farmer registered successfully",
                "farmerId": farmer_id,
                "userName": user_name,
                "email": email,
            }
        ),
        201,
    )


@auth_bp.route("/farmer/login", methods=["POST"])
def login():
    body = request.json or {}
    farmer_id = body.get("farmerId", "").strip()
    password = body.get("password", "")

    if not farmer_id or not password:
        return jsonify({"error": "Farmer ID and password are required"}), 400

    farmer = farmers.find_one({"farmerId": farmer_id})
    if not farmer:
        return jsonify({"error": "Farmer ID not found. Please register first."}), 404

    if not check_password_hash(farmer["password"], password):
        return jsonify({"error": "Incorrect password. Please try again."}), 401

    return (
        jsonify(
            {
                "status": "Login successful",
                "farmerId": farmer["farmerId"],
                "userName": farmer["userName"],
                "email": farmer["email"],
                "state": farmer.get("state", ""),
                "mobile": farmer.get("mobile", ""),
            }
        ),
        200,
    )


@auth_bp.route("/farmer", methods=["GET"])
def get_farmers():
    all_farmers = list(farmers.find({}, {"_id": 0, "password": 0}))
    return jsonify({"farmers": all_farmers, "count": len(all_farmers)}), 200


@auth_bp.route("/farmer/profile/<farmer_id>", methods=["GET"])
def farmer_profile(farmer_id):
    farmer = farmers.find_one({"farmerId": farmer_id.strip()}, {"_id": 0, "password": 0})
    if not farmer:
        return jsonify({"error": "Farmer not found"}), 404

    fid = farmer.get("farmerId", "")
    email = farmer.get("email", "")

    marketplace_farmer = list(
        market_farmers.find(
            {"$or": [{"farmerId": fid}, {"emailId": email}]},
            {"_id": 0},
        )
    )
    marketplace_merchant = list(
        market_merchants.find(
            {"$or": [{"merchantId": fid}, {"emailId": email}]},
            {"_id": 0},
        )
    )

    activity = {
        "registeredAt": farmer.get("createdAt"),
        "hasMarketplaceFarmer": len(marketplace_farmer) > 0,
        "hasMarketplaceMerchant": len(marketplace_merchant) > 0,
        "marketplaceFarmerCount": len(marketplace_farmer),
        "marketplaceMerchantCount": len(marketplace_merchant),
        "modulesUsed": ["Account"],
    }
    if marketplace_farmer:
        activity["modulesUsed"].append("Marketplace (Farmer)")
    if marketplace_merchant:
        activity["modulesUsed"].append("Marketplace (Merchant)")

    return (
        jsonify(
            {
                "profile": farmer,
                "marketplace": {
                    "farmerListings": marketplace_farmer,
                    "merchantListings": marketplace_merchant,
                },
                "activity": activity,
            }
        ),
        200,
    )
