from time import time
import datetime
import hashlib as hasher

""" Class for transactions made on the blockchain. Each transaction has a
    sender, recipient, and value.
    """
class Transaction:
    
    """ Transaction initializer """
    def __init__(self, sender, recipient, value):
        self.sender = sender
        self.recipient = recipient
        self.value = value
    
    """ Converts the transaction to a dictionary """
    def toDict(self):
        return {
            'sender': self.sender,
            'recipient': self.recipient,
            'value': self.value
    }

    def __str__(self):
        toString = self.sender + " -> " + self.recipient + " (" + self.value + ") "
        return toString;

""" Class for Blocks. A block is an object that contains transaction information
    on the blockchain.
    """
class Block:
    def __init__(self, index, data, previous_hash):
        #TODO: Block initializer
        
        self.index = ""
        self.timestamp = ""
        self.previous_hash = ""
        self.data = ""
        self.nonce = ""
        self.time_string = timestamp_to_string();
    
    def compute_hash(self):
        #TODO Implement hashing
        
        return 0
    
    """ Function to convert a timestamp to a string"""
    def timestamp_to_string():
        return datetime.datetime.fromtimestamp(self.timestamp).strftime('%H:%M')
    
    def __str__(self):
        toString =  str(self.index) + "\t" + str(self.timestamp) +"\t\t" + str(self.previous_hash) + "\n"
        for tx in self.data:
            toString +=  "\t" + str(tx) + "\n"
        return toString;

""" Blockchain class. The blockchain is the network of blocks containing all the
    transaction data of the system.
    """
class Blockchain:
    def __init__(self):
        #TODO: implement Blockchain class initializer
        
        self.difficulty = ""
        self.unconfirmed_transactions = ""
        self.chain = ""
    
    def create_genesis_block(self):
        #TODO: implement creating a new genesis block
        return 0;
    
    def new_transaction(self, sender, recipient, value):
        #TODO: implement adding new transactions
        
        return 0;
    
    def mine(self):
        #TODO: implement mining
        
        return 0
    
    def proof_of_work(self, block):
        #TODO: implement proof of work
        
        return 0;
    
    def add_block(self, block):
        #TODO: implement adding a block to a chain
        
        return 0
    
    def check_integrity(self):
        #TODO implement blockchain integrity check
        
        return 0

    """ Function that returns the last block on the chain"""
    @property
    def last_block(self):
        return self.chain[-1]
