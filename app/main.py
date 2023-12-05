
from functools import wraps
from flask import Flask, redirect, render_template, request, session, url_for

# Entrypoint
app = Flask(__name__)

app.config.from_pyfile('config.py')

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
    return render_template('index.xhtml')

if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)
