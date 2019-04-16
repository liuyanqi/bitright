import tlsh
import hashlib as hasher


# file1 = open('doc1.txt', 'rb');
# file2 = open('doc2.txt', 'rb');
# file3 = open('doc1_same.txt', 'rb');
# file4 = open('doc3.txt', 'rb')

# file1_str = file1.read();
# file2_str = file2.read();
# file3_str = file3.read();
# file4_str = file4.read();

# # print(file1_str)
# # print(file3_str)

# h1 = tlsh.hash(file1_str);
# h2 = tlsh.hash(file2_str);
# h3 = tlsh.hash(file3_str);
# h4 = tlsh.hash(file4_str);

# h1_1 = hasher.sha256(file1_str).hexdigest();
# h2_1 = hasher.sha256(file2_str).hexdigest()
# h3_1 = hasher.sha256(file3_str).hexdigest()

# # print(h4)
# diff = tlsh.diff(h1, h2);
# diff2 = tlsh.diff(h4, h1);
# # threshold at 100
# print(diff)
# print(diff2)

def check_text_similarity(path1, path2):
	file1_str = open(path1, 'rb').read();
	file2_str = open(path2, 'rb').read();
	h1 = tlsh.hash(file1_str);
	h2 = tlsh.hash(file2_str);
	diff = tlsh.diff(h1, h2);
	return diff;