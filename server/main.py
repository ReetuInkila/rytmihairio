from functools import wraps
import json
from flask import Flask, make_response, request, session
import requests
from flask_caching import Cache
from accesslink import get_latest_exersises, getFIT
from utilities import *
from secrets import secret
from flask_cors import CORS



# Entrypoint
app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config['SECRET_KEY'] = secret('SECRET_KEY')
app.config["SESSION_PERMANENT"] = False
app.config['SESSION_TYPE'] = 'filesystem'

CORS(app, origins=['https://syke-407909.ew.r.appspot.com', 'http://localhost:3000'])

# 60 min cache
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT':3600})

# Käyttäjän autentikoimiseen vaadittavat päätepisteet
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return json.dumps({'error': 'Authentication required', 'message': 'You need to log in to access this resource'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/verify', methods=['POST'])
def verify_recaptcha():
    try:
        data = request.get_json()
        captcha_value = data.get('captchaValue')

        # Replace 'YOUR_RECAPTCHA_SECRET_KEY' with your actual reCAPTCHA secret key
        secret_key = secret('RECAPTCHA_PRIVATE_KEY')
        verification_url = f'https://www.google.com/recaptcha/api/siteverify?secret={secret_key}&response={captcha_value}'

        response = requests.post(verification_url)
        result = response.json()

        if result.get('success'):
            session['user'] = 'user'
            return json.dumps({'success': True, 'message': 'reCAPTCHA verification successful'})
        else:
            return json.dumps({'success': False, 'message': 'reCAPTCHA verification failed'})
    except Exception as e:
        return json.dumps({'success': False, 'message': f'Error: {str(e)}'})


@app.route('/check_login', methods=['GET'])
def check_login():
    if 'user' in session:
        # User is logged in
        return json.dumps({'loggedIn': True})
    else:
        # User is not logged in
        return json.dumps({'loggedIn': False})

@app.route("/data", methods=['GET'])
@cache.cached()
@login_required
def data():
    id=None
    if id is None:
        exe = get_latest_exersises()
        last = None
        i=len(exe)-1
        while i > -1:
            if exe[i]['has_route']:
                last = exe[i]
                break
            i -= 1
        if last:
            id = last['id']
            
    try:
        fit = getFIT(id)
        fit['timestamps'] = removeGpx(fit['timestamps'], 500)
        data = json.dumps(fit)
        response = make_response(data, 200)
        response.headers['Content-Type'] = 'application/json'
    except Exception as e:
        error_message = f"Error: {str(e)}"
        response = make_response(error_message, 500)
        response.headers['Content-Type'] = 'text/plain'
    return response

if __name__ == '__main__':
    app.run(debug=True)