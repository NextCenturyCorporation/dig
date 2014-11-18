#!/usr/bin/env python
import json
import os
from datetime import datetime,date

def main(
    datadir='/home/dflynt/dig/data',
    infile='mobydick.txt',
    outfile='mb_lines.txt'
  ):
	
	with open(os.path.join(datadir, infile), 'rb') as infile:
		for line in infile:
			words = line.split()

	sentence = []
	with open(os.path.join(datadir, outfile), 'w') as f:
		for word in words:
			if len(sentence) < 8:
				sentence.append(word)
			else:
				line = " ".join(sentence) + '\n'
				f.write(line)
				sentence = []

if __name__ == '__main__':
 main()
