# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, send_from_directory

# configuration
DATABASE = '/tmp/flaskr.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/')
def render():
    return render_template("splash.html")

@app.route('/translations.json')
def translations():
	return render_template("translations.json")

@app.route('/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/', resource)

@app.route('/<username>')
def show_user(username):
    return render_template("index.html", username=username)

@app.route('/<username>/<listname>')
def show_user_list(username, listname):
    return render_template("index.html", username=username, listname=listname)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
