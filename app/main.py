
from functools import wraps
import json
from flask import Flask, make_response, redirect, render_template, request, session, url_for
from flask_caching import Cache
from accesslink import get_latest_exersises, getGPX, getFIT
from secrets import secret
import os

# Entrypoint
app = Flask(__name__)
app.secret_key = secret('SECRET_KEY')

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

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route("/login", methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        password = request.form['password']

        # Tarkistetaan onko salasana oikea. Oikeasti salasana tulisi enkoodata, mutta tässä tapauksessa sen vuotaminen ei ole merkityksellistä
        if password == 'kirjaudu':
            session['user'] = 'user'
            return redirect(url_for('home'))
        else:
            error = 'Väärä salasana'

    return render_template('login.xhtml', error = error)

@app.route("/")
@login_required
def home():
    # Use the cache to store and retrieve the id value
    id = cache.get('latest_exercise_id')

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
            cache.set('latest_exercise_id', id)

    return render_template('index.xhtml', id=id)

@app.route("/data/<id>")
@cache.memoize()
@login_required
def data(id):
    try:
        fit = getFIT(id)
        data = json.dumps(fit)
        response = make_response(data, 200)
        response.headers['Content-Type'] = 'application/json'
    except Exception as e:
        error_message = f"Error: {str(e)}"
        response = make_response(error_message, 500)
        response.headers['Content-Type'] = 'text/plain'
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)