from pymongo import MongoClient

try:
    from ..core.settings import MONGO_URI_AUTH, MONGO_URI_MARKET
except ImportError:
    from core.settings import MONGO_URI_AUTH, MONGO_URI_MARKET


client_auth = MongoClient(MONGO_URI_AUTH)
db_auth = client_auth.get_database()
farmers = db_auth["farmers"]
farmers.create_index("farmerId", unique=True)
farmers.create_index("email", unique=True)

client_market = MongoClient(MONGO_URI_MARKET)
db_market = client_market.get_database()
market_farmers = db_market["farmer"]
market_merchants = db_market["merchant"]
