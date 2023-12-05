from flask import Flask, render_template, request

server = Flask('__main__')
@server.route("/")
def default():
    return render_template('index.html')

server.run("0.0.0.0", 8081, debug=True)