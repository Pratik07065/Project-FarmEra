from app import app, db, Farmer, Merchant

# --- Raw Data Lists ---

farmers_data = [
    {
        "name": "Ramesh Gupta",
        "farmer_id": "FARM-001",
        "address": "Village Palampur, Dist Pune, Maharashtra",
        "contact": "9876543210",
        "email": "ramesh.g@example.com",
        "product": "Onion",
        "quantity": "500 kg",
        "price": "25000"
    },
    {
        "name": "Suresh Patel",
        "farmer_id": "FARM-002",
        "address": "Sector 4, Gandhinagar, Gujarat",
        "contact": "9898989898",
        "email": "suresh.p@example.com",
        "product": "Wheat",
        "quantity": "1000 kg",
        "price": "32000"
    },
    {
        "name": "Anita Devi",
        "farmer_id": "FARM-003",
        "address": "Kisan Nagar, Patna, Bihar",
        "contact": "9123456789",
        "email": "anita.d@example.com",
        "product": "Rice (Basmati)",
        "quantity": "200 kg",
        "price": "18000"
    },
    {
        "name": "Vikram Singh",
        "farmer_id": "FARM-004",
        "address": "Farm House 12, Ludhiana, Punjab",
        "contact": "8877665544",
        "email": "vikram.s@example.com",
        "product": "Potato",
        "quantity": "750 kg",
        "price": "15000"
    }
]

merchants_data = [
    {
        "name": "Fresh Mandi Traders",
        "merchant_id": "MERCH-101",
        "address": "Shop 12, APMC Market, Mumbai",
        "contact": "9988776655",
        "email": "contact@freshmandi.com",
        "product": "Onion",
        "quantity": "2000 kg",
        "price": "28000"
    },
    {
        "name": "Gujarat Agro Exports",
        "merchant_id": "MERCH-102",
        "address": "Industrial Area, Surat",
        "contact": "9112233445",
        "email": "sales@gujaratagro.com",
        "product": "Cotton",
        "quantity": "500 bales",
        "price": "150000"
    },
    {
        "name": "Big Basket Suppliers",
        "merchant_id": "MERCH-103",
        "address": "Warehouse 5, Bangalore",
        "contact": "9000011111",
        "email": "vendor@bigbasketcopy.com",
        "product": "Tomato",
        "quantity": "300 kg",
        "price": "6000"
    }
]

def seed_database():
    """Adds raw data to the database."""
    # We must use app_context() to access the database config
    with app.app_context():
        # Optional: Create tables if they don't exist yet
        db.create_all()
        print("Checked database tables...")

        # Add Farmers
        print("Adding Farmers...")
        for data in farmers_data:
            # Check if this farmer_id already exists to avoid duplicates (Optional safety)
            existing = Farmer.query.filter_by(farmer_id=data['farmer_id']).first()
            if not existing:
                new_farmer = Farmer(**data) # **data unpacks the dictionary
                db.session.add(new_farmer)
        
        # Add Merchants
        print("Adding Merchants...")
        for data in merchants_data:
            existing = Merchant.query.filter_by(merchant_id=data['merchant_id']).first()
            if not existing:
                new_merchant = Merchant(**data)
                db.session.add(new_merchant)

        # Commit changes
        try:
            db.session.commit()
            print("✅ Success! Raw data added to 'marketplace.db'.")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error adding data: {e}")

if __name__ == '__main__':
    seed_database()