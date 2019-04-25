from time import time
import datetime
import os
import pickle
import hashlib as hasher
import acoustic.acoustid_check as ac
import text_compare.test_text as tc
import image_compare.image_check as ic

""" Class for transactions made on the blockchain. Each transaction has a
    sender, recipient, and value.
    """
class Transaction: 
    
    """ Transaction initializer """
    def __init__(self, title="", filename="", author="", public_key="", genre="", media = ""):
        self.title = title
        self.filename = filename
        self.author = author
        self.public_key = public_key
        self.genre = genre
        self.media = media
        #f = open(media, "rb")
        #content = f.readlines()
        #self.hash_media = hasher.sha256(content).hexdigest()
    
    """ Converts the transaction to a dictionary """
    def toDict(self):
        return {
            'title': self.title,
            'filename': self.filename,
            'author': self.author,
            'public_key': self.public_key,
            'genre': self.genre,
            'media': self.media,
            #"hash_media" : self.hash_media
    }

    def __str__(self):
        toString = self.author + " : " + self.genre + " (" + self.media + ") "
        return toString;

""" Class for Blocks. A block is an object that contains transaction information
    on the blockchain.
    """
class Block:
    def __init__(self, index, transaction, previous_hash):
        #TODO: Block initializer
        
        self.index = index
        self.timestamp = time()
        self.previous_hash = previous_hash
        self.transaction = transaction
    
    def compute_hash(self):
        #TODO Implement hashing
        concat_str = str(self.index) + str(self.timestamp) + str(self.previous_hash) + str(self.transaction['author']) + str(self.transaction['genre'])
        hash_result = hasher.sha256(concat_str.encode('utf-8')).hexdigest()
        return hash_result

    def serialize(self):
        return {
            'index': self.index,
            'timestamp': self.timestamp,
            'previous_hash': self.previous_hash,
            'transaction': self.transaction
        }


""" Blockchain class. The blockchain is the network of blocks containing all the
    transaction data of the system.
    """
class Blockchain:
    def __init__(self):
        #TODO: implement Blockchain class initializer
        
        
        self.unconfirmed_transactions = {}
        self.chain = []
    
    def create_genesis_block(self):
        #TODO: implement creating a new genesis block
        empty_media = {
            'title': "",
            'filename': "",
            'author': "",
            'public_key': "",
            'genre': "",
            'media': "",
            #"hash_media" : ""
        }
        new_block = Block(index=0, transaction=empty_media, previous_hash=0)
        self.add_block(new_block)
        # initialize blockchian json folder

        return new_block
    
    def new_transaction(self, title, filename, author, public_key, genre, media):
        #TODO: implement adding new transactions
        new_trans = Transaction(title, filename, author, public_key, genre, media).toDict();
        self.unconfirmed_transactions= new_trans.copy()
        return new_trans
    
    def mine(self):
        #TODO: create a block, verify its originality and add to the blockchain
        if (len(self.chain) ==0):
            block_idx = 1
            previous_hash = 0
        else:
            block_idx = self.chain[-1].index + 1
            previous_hash = self.chain[-1].compute_hash()
        block = Block(block_idx, self.unconfirmed_transactions, previous_hash)
        if(self.verify_block(block)):
            self.add_block(block)
            return block
        else:
            return None
    
    def verify_block(self, block):
        #TODO: verify song originality and previous hash
        #check previous hash

        if len(self.chain) ==0:
            previous_hash = 0
        else:
            previous_hash = self.chain[-1].compute_hash()
        if block.previous_hash != previous_hash:
            return 0
        print("helllloooooo2")
        #check originality
        for prev_block in self.chain:
           if block.transaction['genre'] == prev_block.transaction['genre']:
                try:
                    if block.transaction['genre'] == 'Audio':
                        score = ac.calc_accuracy('./uploads/' + block.transaction['media'], './uploads/' + prev_block.transaction['media'])
                        print(score)
                        if score > 0.9:
                          return 0
                    if block.transaction['genre'] == 'Text':
                        score = tc.check_text_similarity('./uploads/' + block.transaction['media'], './uploads/'+prev_block.transaction['media'])
                        print(score)
                        if score < 100:
                            return 0
                    if block.transaction['genre'] == "Image":
                        score = ic.calc_accuracy('./uploads/' + block.transaction['media'], './uploads/' + prev_block.transaction['media'])
                        print(score)
                        if score < 0.4:
                            return 0
                except:
                    return 0
        return 1

    def lookup(self, transaction):
        #check originality
        for prev_block in self.chain:
           if transaction['genre'] == prev_block.transaction['genre']:
                try:
                    if transaction['genre'] == 'Audio':
                        score = ac.calc_accuracy('./tmp/' + transaction['media'], './uploads/' + prev_block.transaction['media'])
                        print(score)
                        if score > 0.9:
                          return prev_block
                    if transaction['genre'] == 'Text':
                        score = tc.check_text_similarity('./tmp/' + transaction['media'], './uploads/'+prev_block.transaction['media'])
                        print(score)
                        if score < 100:
                            return prev_block
                    if transaction['genre'] == "Image":
                        score = ic.calc_accuracy('./tmp/' + transaction['media'], './uploads/' + prev_block.transaction['media'])
                        print(score)
                        if score < 0.4:
                            return prev_block
                except:
                    print("exception")
                    return prev_block
        return None
    
    def add_block(self, block):
        #TODO: add the block to chain
        self.chain.append(block)
        
        # with open('./blockchain/chain.json', 'w') as outfile:
        #     bc=[b.serialize() for b in self.chain]
        #     json.dump(bc, outfile)
        with open('./blockchain/chain.pkl', 'wb') as output:
            pickle.dump(self.chain, output, pickle.HIGHEST_PROTOCOL)

    
    def check_integrity(self):
        #TODO implement blockchain integrity check
        return 0

    """ Function that returns the last block on the chain"""
    @property
    def last_block(self):
        return self.chain[-1]
