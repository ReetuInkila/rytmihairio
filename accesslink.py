
from utils import load_config
import requests

# Config tiedostossa on tallennettuna client id ja client secret sekä muita autorisointi tokeneita
CONFIG_FILENAME = "config.yml"
config = load_config(CONFIG_FILENAME)

def getUserInfo():
    headers = {'Accept': 'application/json',  'Authorization': 'Bearer '+config['access_token']}

    r = requests.get('https://www.polaraccesslink.com/v3/users/'+str(config['user_id']), headers = headers)

    if r.status_code >= 200 and r.status_code < 400:
        return(r.json())
    else:
        return(r)

print(getUserInfo()) 