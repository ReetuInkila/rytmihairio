from flask import Flask, redirect, request, jsonify, session
from flask_oauthlib.client import OAuth
import requests
import json
import base64

with open("credentials.json", "r") as f:
    data = json.load(f)

app = Flask(__name__)
app.secret_key = 'super secret key'
oauth = OAuth(app)

polar = oauth.remote_app(
    'polar',
    consumer_key=data["client_id"],
    consumer_secret=data["client_secret"],
    request_token_params={'scope': 'accesslink.read_all'},
    base_url='https://www.polaraccesslink.com/v3',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://www.polaraccesslink.com/v3/oauth2/token',
    authorize_url='https://flow.polar.com/oauth2/authorization'
)

@app.route('/login')
def login():
    return polar.authorize(callback='http://127.0.0.1:5000/callback')

@app.route('/callback')
def callback():
    session['polar_token'] = request.args.get('code')
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('polar_token', None)
    return redirect('/')

@app.route('/')
def homepage():
    if 'polar_token' in session:
        authorization_code = session['polar_token']

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
            'code': authorization_code,
            'redirect_uri':'http://127.0.0.1:5000/callback'}

        r = requests.post('https://polarremote.com/v2/oauth2/token', data=body, headers=headers)

        print(r.json())



        return '<a href="/logout">logout</a>'

    else:
        return 'Please <a href="/login">login</a>'

if __name__ == '__main__':
    app.run(debug=True)
