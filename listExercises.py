import io
import requests
from utils import load_config
import json
import mysql.connector

# Config tiedostossa on tallennettuna client id ja client secret sekä muita autorisointi tokeneita
CONFIG_FILENAME = "config.yml"
config = load_config(CONFIG_FILENAME)

tiedosto = io.open("../pythonAnywhere/sykeMySQL.json", encoding="UTF-8")
dbconfig = json.load(tiedosto)

# Yhdistä MySQL-tietokantaan
connection = mysql.connector.connect(
    host=dbconfig['host'],
    user=dbconfig['user'],
    password=dbconfig['passwd'],
    database=dbconfig['database']
)

# Luo kursori
cursor = connection.cursor()

# Määritä taulun luomiskomento
table_creation_query = '''
CREATE TABLE IF NOT EXISTS your_table_name (
    id INT PRIMARY KEY,
);
'''

# Suorita luomiskomento
cursor.execute(table_creation_query)

# Vahvista muutokset
connection.commit()

# Sulje kursori ja yhteys
cursor.close()
connection.close()

headers = {'Accept': 'application/json',  'Authorization': 'Bearer '+config['access_token']}
r = requests.get('https://www.polaraccesslink.com/v3/exercises', headers = headers)

if r.status_code >= 200 and r.status_code < 400:
    data= r.json()
    for i in data:
        print(i['id'])
else:
    print(r)
