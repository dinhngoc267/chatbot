from flask import Flask, render_template
import core.model as model 
app = Flask(__name__, static_folder='static')

@app.route("/")
def main():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)
    