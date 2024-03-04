from datetime import timedelta
import json
import secrets
from flask import Flask, jsonify, make_response, render_template, request
import requests
from accesslink import get_latest_exersises, getFIT
from utilities import *
from secret import secret
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, decode_token
from flask_caching import Cache

from dotenv import load_dotenv
load_dotenv()


# Entrypoint
app = Flask(__name__, static_url_path='', static_folder='frontend', template_folder='frontend')
app.config['SECRET_KEY'] = secret('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = secret('SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# 60 min cache
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT':3600})

@app.route("/")
def hello():
    return render_template("index.html")

@app.route('/api/verify', methods=['POST'])
def verify_recaptcha():
    try:
        data = request.get_json()
        captcha_value = data.get('captchaValue')

        secret_key = secret('RECAPTCHA_PRIVATE_KEY')
        verification_url = f'https://www.google.com/recaptcha/api/siteverify?secret={secret_key}&response={captcha_value}'

        response = requests.post(verification_url)
        result = response.json()

        # Generate a random string of 20 characters
        random_identity = secrets.token_hex(10)

        if result.get('success'):
            access_token = create_access_token(identity=random_identity)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify(message='Invalid reCAPTCHA'), 401
    except Exception as e:
        return jsonify(message=f'Error: {str(e)}'), 401


@app.route("/api/data", methods=['GET'])
@jwt_required()
@cache.cached()
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


# Endpoint to check if a token is still valid
@app.route('/api/check_token', methods=['POST'])
def check_token():
    try:
        data = request.get_json()
        token = data.get('token')
        decoded_token = decode_token(token)
        return jsonify(valid=True, message='Token ok!'), 200
    except Exception as e:
        return jsonify(valid=False, message='Invalid token'), 401


if __name__ == '__main__':
    app.run(debug=True)
