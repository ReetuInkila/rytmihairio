
from functools import wraps
import json
from flask import Flask, make_response, redirect, render_template, request, session, url_for


from accesslink import get_latest_exersises, getGPX


# Entrypoint
app = Flask(__name__)

app.config.from_pyfile('configApp.py')

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
    return render_template('index.xhtml', id=id)

@app.route("/gpx/<id>")
@login_required
def gpx(id):
    gpx = getGPX(id)
    xml_string = gpx.decode('utf-8')

    resp = make_response(xml_string, 200)
    resp.charset = 'utf-8'
    resp.mimetype = 'application/xml'
    return resp



if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)