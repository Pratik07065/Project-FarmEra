from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allows React to talk to Flask

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marketplace.db'
db = SQLAlchemy(app)

# Models
class Farmer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    farmer_id = db.Column(db.String(50))
    address = db.Column(db.String(200))
    contact = db.Column(db.String(20))
    email = db.Column(db.String(100))
    product = db.Column(db.String(100))
    quantity = db.Column(db.String(50))
    price = db.Column(db.String(50))

class Merchant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    merchant_id = db.Column(db.String(50))
    address = db.Column(db.String(200))
    contact = db.Column(db.String(20))
    email = db.Column(db.String(100))
    product = db.Column(db.String(100))
    quantity = db.Column(db.String(50))
    price = db.Column(db.String(50))

# Routes
@app.route('/api/farmer', methods=['POST'])
def add_farmer():
    data = request.json
    new_farmer = Farmer(**data)
    db.session.add(new_farmer)
    db.session.commit()
    return jsonify({"message": "Farmer added successfully"}), 201

@app.route('/api/merchant', methods=['POST'])
def add_merchant():
    data = request.json
    new_merchant = Merchant(**data)
    db.session.add(new_merchant)
    db.session.commit()
    return jsonify({"message": "Merchant added successfully"}), 201

@app.route('/api/all_info', methods=['GET'])
def get_all():
    farmers = Farmer.query.all()
    merchants = Merchant.query.all()
    
    # Format data for frontend cards
    data = []
    for f in farmers:
        data.append({"type": "Farmer", "name": f.name, "product": f.product, "qty": f.quantity, "price": f.price})
    for m in merchants:
        data.append({"type": "Merchant", "name": m.name, "product": m.product, "qty": m.quantity, "price": m.price})
    
    return jsonify(data)

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Creates the database file
    app.run(debug=True)