from flask import Flask, redirect, request, jsonify, session
from utils import load_config, save_config
from flask_oauthlib.client import OAuth
import requests
import json
import base64


# Config tiedostossa on tallennettuna client id ja client secret sekä muita autorisointi tokeneita
CONFIG_FILENAME = "config.yml"
config = load_config(CONFIG_FILENAME)


app = Flask(__name__)
app.secret_key = config['secret_key']
oauth = OAuth(app)

auth = oauth.remote_app(
    'polar',
    consumer_key=config['client_id'],
    consumer_secret=config['client_secret'],
    request_token_params={'scope': 'accesslink.read_all'},
    access_token_method='POST',
    base_url='https://www.polaraccesslink.com/v3',
    access_token_url='https://polarremote.com/v2/oauth2/token',
    authorize_url='https://flow.polar.com/oauth2/authorization'
)


@app.route("/")
def authorize():
    return auth.authorize(callback='http://127.0.0.1:5000/callback')


@app.route('/callback')
def callback():
    code = request.args.get('code')

    message = config["client_id"]+':'+config["client_secret"]
    message_bytes = message.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = 'Basic ' + base64_bytes.decode('ascii') 

    headers = {
            'Authorization': base64_message,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'}
    body = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri':'http://127.0.0.1:5000/callback'}

    r = requests.post(auth.access_token_url, data=body, headers=headers)
    response = r.json()

    config["authorization_code"] = code
    config["user_id"] = response["x_user_id"]
    config["access_token"] = response["access_token"]
    save_config(config, CONFIG_FILENAME)

    return "Authorization ended successfully! You can now close this page."

    

if __name__ == '__main__':
    app.run(debug=True)