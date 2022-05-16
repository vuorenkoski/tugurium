#!/usr/bin/python

# Code to send photo to server
# first argument is imagename, second filaname

import sys
import requests

url = 'http://localhost:4000/image/'
# url = 'https://tempview.vuorenkoski.fi/api/image/'
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlbnNvciIsImlkIjoxLCJpYXQiOjE2NTEwNDY0OTN9.942e6l55Eh0y9nWwsdkS_s-q_6-EXeoGnDdsKp6vXho'

f = open(sys.argv[2], "rb")
headers = {'Authorization': 'BEARER ' + token}
files = {'file': ('image.jpg', f, 'application/jpg')}

try:
    requests.post(url+sys.argv[1], files=files, headers=headers)
except:
    pass
