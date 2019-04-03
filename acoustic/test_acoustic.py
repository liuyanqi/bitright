import acoustid
import numpy as np
import chromaprint

path = './heaven.mp3'
path2 = './heaven_small.mp3'
path3 = './undertheice.mp3'

dur, fig = acoustid.fingerprint_file(path)
# fig = np.fromstring(fig, uint8);
raw_fp = chromaprint.decode_fingerprint(fig)[0]
fp = ','.join(map(str, raw_fp))
fig = fp.decode('utf8')


dur, fig2 = acoustid.fingerprint_file(path2)
raw_fp2 = chromaprint.decode_fingerprint(fig2)[0]

dur, fig3 = acoustid.fingerprint_file(path3)
raw_fp3 = chromaprint.decode_fingerprint(fig3)[0]

popcnt_table_8bit = [
    0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8,
]

def popcnt(x):
    """
    Count the number of set bits in the given 32-bit integer.
    """
    return (popcnt_table_8bit[(x >>  0) & 0xFF] +
            popcnt_table_8bit[(x >>  8) & 0xFF] +
            popcnt_table_8bit[(x >> 16) & 0xFF] +
            popcnt_table_8bit[(x >> 24) & 0xFF])


error = 0
for x, y in zip(raw_fp, raw_fp2):
    error += popcnt(x ^ y)
print 1.0 - error / 32.0 / min(len(raw_fp), len(raw_fp2))

error = 0
for x, y in zip(raw_fp2, raw_fp3):
    error += popcnt(x ^ y)
print 1.0 - error / 32.0 / min(len(raw_fp2), len(raw_fp3))