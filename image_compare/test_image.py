from image_match.goldberg import ImageSignature
gis = ImageSignature()
a = gis.generate_signature('./MonaLisa_1.jpg');
b = gis.generate_signature('./MonaLisa_2.jpg');
c = gis.generate_signature('./Other.jpg');
dist = gis.normalized_distance(a,b)
dist2 = gis.normalized_distance(a,c);
# normalized distance < 0.4 likely to be a match
print(dist)
print(dist2)

