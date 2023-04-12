import time
import sys
import csv 

file = sys.argv[1]
data = None
with open(file) as f:
    reader = csv.reader(f)
    data = list(reader)

ms = 0
i = 2
while i < len(data):
    ms += int(data[i][0])
    if int(data[i][0])> 3*int(data[i-1][0]):
        print(data[i-3])
        print(data[i-2])
        print(data[i-1])
        print(data[i], 60000/int(data[i-1][0]), time.strftime('%H:%M:%S', time.gmtime(ms/1000)))
    i += 1