import requests
from configTransaction import *


def listExercises():
    headers = {'Accept': 'application/json',  'Authorization': 'Bearer ' + access_token}
    r = requests.get('https://www.polaraccesslink.com/v3/users/' + user_id +'/exercise-transactions/' + transaction_id, headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.json()
    else:
        return r


def getGPX(exerciseId):
    headers = {'Accept': 'application/gpx+xml',  'Authorization': 'Bearer '+access_token}

    r = requests.get('https://www.polaraccesslink.com/v3/exercises/'+exerciseId+'/gpx', headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.content
    else:
        return r
    

def get_latest_exersises(token=None):
    if token:
        headers = {'Accept': 'application/json',  'Authorization': 'Bearer '+ token}
    else:
        headers = {'Accept': 'application/json',  'Authorization': 'Bearer '+ access_token}
    
    r = requests.get('https://www.polaraccesslink.com/v3/exercises', headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.json()
    else:
        return r 