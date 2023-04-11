import numpy as np
import sys
import csv 

file = sys.argv[1]
data = None
with open(file) as f:
    reader = csv.reader(f)
    data = list(reader)

time = 0
i = 1
while i < len(data):
    time += int(data[i][0])
    print(time/60000)
    i += 1