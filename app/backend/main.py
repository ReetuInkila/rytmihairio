
from functools import wraps
import json
import os
from flask import Flask, make_response, redirect, render_template, request, session, url_for
from flask_wtf import FlaskForm, RecaptchaField
from flask_caching import Cache
from accesslink import get_latest_exersises, getFIT
from utilities import *
from secrets import secret


# Entrypoint
app = Flask(__name__)
app.config['SECRET_KEY'] = secret('SECRET_KEY')
app.config['RECAPTCHA_PUBLIC_KEY'] = secret('SITE_KEY')
app.config['RECAPTCHA_PRIVATE_KEY'] = secret('RECAPTCHA_PRIVATE_KEY')

# 60 min cache
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT':3600})

# Käyttäjän autentikoimiseen vaadittavat päätepisteet
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
def home():
    return "toimii"

@app.route("/data/")
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