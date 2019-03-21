from flask import Flask, request, render_template, jsonify, redirect
from blockchain import Blockchain

app =  Flask(__name__)

# the node's copy of blockchain
blockchain = Blockchain()

@app.route('/')
def index():
    return render_template('./index.html')


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

app.run(debug=True, port=8000)
