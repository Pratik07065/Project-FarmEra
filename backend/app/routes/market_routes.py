from flask import Blueprint, jsonify, request

try:
    from ..db.mongo import market_farmers, market_merchants
except ImportError:
    from db.mongo import market_farmers, market_merchants


market_bp = Blueprint("market", __name__)


@market_bp.route("/market/farmer", methods=["POST", "GET"])
def market_farmer_data():
    if request.method == "POST":
        body = request.json or {}

        name = body.get("Name")
        farmer_id = body.get("farmerId")
        contact = body.get("contact")
        email_id = body.get("emailId")
        product = body.get("product")
        quantity = body.get("quantity")
        price = body.get("price")

        if not name:
            return jsonify({"error": "Missing 'Name' field"}), 400

        doc = {
            "Name": name,
            "farmerId": farmer_id,
            "contact": contact,
            "emailId": email_id,
            "product": product,
            "quantity": quantity,
            "price": price,
        }

        market_farmers.insert_one(doc)

        doc["status"] = "Data saved successfully"
        doc.pop("_id", None)
        return jsonify(doc), 201

    farmers_data = list(market_farmers.find({}, {"_id": 0}))
    return jsonify(farmers_data), 200


@market_bp.route("/market/merchant", methods=["POST", "GET"])
def market_merchant_data():
    if request.method == "POST":
        body = request.json or {}

        name = body.get("Name")
        merchant_id = body.get("merchantId")
        contact = body.get("contact")
        email_id = body.get("emailId")
        product = body.get("product")
        quantity = body.get("quantity")
        price = body.get("price")

        doc = {
            "Name": name,
            "merchantId": merchant_id,
            "contact": contact,
            "emailId": email_id,
            "product": product,
            "quantity": quantity,
            "price": price,
        }

        market_merchants.insert_one(doc)

        doc["status"] = "Data posted to MongoDB"
        doc.pop("_id", None)
        return jsonify(doc), 201

    merchants_data = list(market_merchants.find({}, {"_id": 0}))
    return jsonify(merchants_data), 200


@market_bp.route("/market/all_info", methods=["GET"])
def get_all_market_data():
    farmers_data = list(market_farmers.find({}, {"_id": 0}))
    merchants_data = list(market_merchants.find({}, {"_id": 0}))
    return jsonify(farmers_data + merchants_data), 200
