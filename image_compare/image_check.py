from image_match.goldberg import ImageSignature

def calc_accuracy(path1, path2):
	print(path1, path2)
	path1 = str(path1)
	path2 = str(path2)
	gis = ImageSignature()
	a = gis.generate_signature(path1);
	b = gis.generate_signature(path2);
	dist = gis.normalized_distance(a,b);
	return dist;
