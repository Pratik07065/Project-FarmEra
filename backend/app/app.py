from flask import Flask , render_template,request,jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app= Flask(__name__)

client=MongoClient('mongodb://localhost:27017')
db=client['marketplace']
CORS(app)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/farmer', methods=['POST', 'GET'])
def farmerData():
    if request.method == 'POST':
        body = request.json
        
        # Using .get() prevents the KeyError crash
        Name = body.get('Name')
        farmerId = body.get('farmerId')
        contact = body.get('contact') # Fixed typo 'conatct'
        emailId = body.get('emailId')
        product = body.get('product')
        quantity = body.get('quantity')
        price = body.get('price') # Fixed your 'body' typo here too

        # Quick validation check
        if not Name:
            return jsonify({"error": "Missing 'Name' field"}), 400

        db['farmer'].insert_one({
            'Name': Name,
            'farmerId': farmerId,
            'contact': contact,
            'emailId': emailId,
            'product': product,
            'quantity': quantity,
            'price': price
        })
        
        return jsonify({
            'status': 'Data saved successfully', 
            'Name': Name,
            'farmerId': farmerId,
            'contact': contact,
            'emailId': emailId,
            'product': product,
            'quantity': quantity,
            'price': price
            })
    
@app.route('/merchant',methods=['POST','GET'])
def merchantData():
    if request.method == 'POST':
        body=request.json
        Name = body.get('Name')
        merchantId = body.get('merchantId')
        contact = body.get('contact') # Fixed typo 'conatct'
        emailId = body.get('emailId')
        product = body.get('product')
        quantity = body.get('quantity')
        price = body.get('price') 

        db['merchant'].insert_one({
            'Name':Name,
            'merchantId':merchantId,
            'contact':contact,
            'emailId':emailId,
            'product':product,
            'quantity':quantity,
            'price':price
        })
        return jsonify({
            'status':'data is posted to mongodb',
            'Name':Name,
            'merchantId':merchantId,
            'contact':contact,
            'emailId':emailId,
            'product':product,
            'quantity':quantity,
            'price':price
        })
    
# @app.route('/fmInfo',methods=['POST','GET'])
# def allData():
#     if request.method=='GET':


if __name__=='__main__':
    app.debug = True
    app.run()