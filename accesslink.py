import requests
import json
import base64
from accesslink import *

with open("credentials.json", "r") as f:
    data = json.load(f)

def getAccessToken():
    message = data["client_id"]+':'+data["client_secret"]
    message_bytes = message.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = 'Basic ' + base64_bytes.decode('ascii') 

    headers = {
            'Authorization': base64_message,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'}
    body = {
        'grant_type': 'authorization_code',
        'code': data['authorization_code'],
        'redirect_uri':'http://127.0.0.1:5000/callback'}

    r = requests.post('https://polarremote.com/v2/oauth2/token', data=body, headers=headers)

    
    return r.json()

def getUser():
    accesslink = accesslink.AccessLink(client_id=data["client_id"], client_secret=data["client_secret"])
    user_info = accesslink.users.get_information(user_id=data['x_user_id'], access_token=data['access_token'])
    return user_info

def getNotifications():
    headers = {'Accept': 'application/json'}
    r = requests.get('https://www.polaraccesslink.com/v3/notifications', headers = headers)
    return r

print(getUser())






#r = requests.post('https://www.polaraccesslink.com/v3/users/{'+str(access['x_user_id'])+'}/exercise-transactions', headers = headers)

#print(r)