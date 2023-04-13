from flask import Flask, redirect, request, jsonify, session
from flask_oauthlib.client import OAuth
import requests
import json

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
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic dGhpc2RvZXNudDpkb2FueXRoaW6s',
            'Accept': 'application/json'}
        body = {
            'grant_type': 'authorization_code',
            'authorization_code': authorization_code}

        r = requests.post('https://polarremote.com/v2/oauth2/token', data=body, headers=headers)

        print(r.json())


        return 'Hello Polar!'

    else:
        return 'Please <a href="/login">login</a>'

if __name__ == '__main__':
    app.run(debug=True)
