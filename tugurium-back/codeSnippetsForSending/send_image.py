#!/usr/bin/python

# Code to send photo to server
# first argument is imagename, second filaname

import sys
import requests

url = 'https://tugurium.herokuapp.com/api/image/'
token = 'xxxx'

f = open(sys.argv[2], "rb")
headers = {'Authorization': 'BEARER ' + token}
files = {'file': ('image.jpg', f, 'application/jpg')}

try:
    res = requests.post(url+sys.argv[1], files=files, headers=headers)
    print(res)
except:
    pass
