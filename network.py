#!/usr/bin/env python
import os
import hashlib
from flask import Flask, request, render_template, jsonify, redirect
from blockchain import Blockchain

UPLOAD_FOLDER = 'uploads'

app =  Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# the node's copy of blockchain
blockchain = Blockchain()

@app.route('/')
def index():
    return render_template('./index.html')

@app.route('/blockchain')
def blockchain_page():
    return render_template('./blockchain.html')


@app.route('/new_transaction', methods=['POST'])
def new_transaction():
	sender = request.form["sender"]
	recipient = request.form["recipient"]
	value = request.form["value"]

	blockchain.new_transaction(sender, recipient, value);

	return redirect('/')

@app.route('/pending_tx')
def get_pending_tx():
	transactions = blockchain.unconfirmed_transactions
	response = {'transactions': transactions}
	return jsonify(response), 200

@app.route('/mine', methods=['GET'])
def mine_unconfirmed_transactions():
	result = blockchain.mine()
	response = {'block': result.__dict__}

	return jsonify(response), 200

@app.route('/chain', methods=['GET'])
def get_chain():
	chain_data = []
	for block in blockchain.chain:
		chain_data.append(block.__dict__)

	response = {'chain': chain_data}
	return jsonify(response), 200

@app.route('/get_block', methods=['POST'])
def get_block():
	index = int(request.form["block_index"])
	block = blockchain.chain[index]

	response = {'block': block.__dict__}

	return jsonify(response), 200

@app.route('/reset')
def reset():
	global blockchain
	
	blockchain = Blockchain()

	return redirect('/')

@app.route('/integrity', methods=['GET'])
def integrityn():
	integrity = blockchain.check_integrity();

	response = {'integrity': integrity}

	return jsonify(response), 200

@app.route('/upload', methods=['POST'])
def upload():
	global blockchain

	print(request)
	if 'contentFile' not in request.files:
		response = {'ok': False}
		return jsonify(response), 500
	file = request.files['contentFile']
	
	filename = hashlib.sha256(file.read()).hexdigest()
	file.seek(0) #reset read pointer

	action = request.form['action']

	if action == "lookup":
		#TODO search for exact and partial matches
		print('TODO lookup')
	elif action == "publish":
		if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
			print("Duplicate Detected")
			response = {'ok': False}
		else:
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			#Create a new transaction
			author = request.form['author']
			title = request.form['title']
			pubkey = request.form['pubkey']
			genre = request.form['genre']
			original_filename = file.filename
			blockchain.new_transaction(title, original_filename, author, pubkey, genre, filename)
			result = blockchain.mine()
			if result == None:
				print("FALSE")
				os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename)) #remove uploaded file
				response = {'ok': False}
			else:
				print("TEST")
				print(result)
				response = {'ok': True, 'block': result.__dict__}

		return jsonify(response), 200



app.run(debug=True, port=8000)
