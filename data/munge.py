#!/usr/bin/env python
import json
import os
from datetime import datetime,date

def main(
    datadir='/home/dflynt/dig/data',
    if1='mock_ads_5k.json',
    if2='mb_lines.txt',
    of='ads5k_es.json'
  ):

	titles = []
	with open(os.path.join(datadir, if2), 'rb') as infile:
		for row in infile:
			titles.append(row)

	print len(titles)

	with open(os.path.join(datadir, if1), 'rb') as jsonfile:
		ads = json.load(jsonfile)
		
	for ad in ads:
		i = ad['id'] - 1
		ad['title'] = titles[i]
		# convert to elastic search basic date
		str_date_from = ad['date']
		dto = datetime.strptime(str_date_from, '%m/%d/%Y')
		ad['date'] = dto.date().strftime('%Y%m%d')
		# convert phone (remove first two characters)
		phone = ad['phone']
		ad['phone'] = phone[2:len(phone)]

	with open(os.path.join(datadir, of), 'w') as outfile:
		for ad in ads:
			s = '{"index":{"_index":"mockads","_type":"ad","_id":' + str(ad['id']) + '}}\n'
			outfile.write(s)
			outfile.write(json.dumps(ad) + '\n')




if __name__ == '__main__':
 main()
