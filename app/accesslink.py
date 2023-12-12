import requests
import fitparse
from secrets import secret

def listExercises():
    headers = {'Accept': 'application/json',  'Authorization': 'Bearer ' + secret('ACCESS_TOKEN')}
    r = requests.get('https://www.polaraccesslink.com/v3/users/' + secret('USER_ID') +'/exercise-transactions/' + secret('TRANSACTION_ID'), headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.json()
    else:
        return r


def getGPX(exerciseId):
    headers = {'Accept': 'application/gpx+xml',  'Authorization': 'Bearer ' + secret('ACCESS_TOKEN')}

    r = requests.get('https://www.polaraccesslink.com/v3/exercises/'+exerciseId+'/gpx', headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.content
    else:
        return r


def get_latest_exersises(token=None):
    if token:
        headers = {'Accept': 'application/json',  'Authorization': 'Bearer ' + token}
    else:
        headers = {'Accept': 'application/json',  'Authorization': 'Bearer ' + secret('ACCESS_TOKEN')}

    r = requests.get('https://www.polaraccesslink.com/v3/exercises', headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return r.json()
    else:
        return r 

def getFIT(exerciseId):
    headers = {'Accept': 'application/gpx+xml',  'Authorization': 'Bearer ' + secret('ACCESS_TOKEN')}

    r = requests.get('https://www.polaraccesslink.com/v3/exercises/'+exerciseId+'/fit', headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return(read_fit(r.content))
    else:
        return r
    



def read_fit(fit_data):

    fitfile = fitparse.FitFile(fit_data)
    data_list = []
    first_timestamp = None
    for record in fitfile.get_messages():
        
        timestamp = None
        heart_rate = None

        for data in record:
            if data.name == 'timestamp':
                timestamp = data.value
            elif data.name == 'heart_rate':
                heart_rate = data.value

        if timestamp is not None and heart_rate is not None:
            if first_timestamp is None:
                first_timestamp = timestamp
            time_difference = timestamp - first_timestamp
            hours, remainder = divmod(time_difference.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)

            data_list.append({'timestamp': f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}", 'heart_rate': heart_rate})

    return data_list