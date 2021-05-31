from flask import Flask, render_template, request, jsonify
import core.model as model 
import json

app = Flask(__name__, static_folder='static')

questions =[
    "In the last year, do you feel you have grown in terms of your knowledge and capabilities?",
    "Do you feel the organization's policies and benefits are employee-friendly?"
]

@app.route("/", methods=['GET'])
def main():
    return render_template("index.html")

@app.route("/get-first-question", methods=['GET'])
def get_first_question():
    return jsonify(response=questions[0])

@app.route("/", methods=['POST'])
def get_response():
    data = json.loads(request.data)
    answer = data.get('answer')
    question_index = data.get('question_index') #request.args.get('question_index', 0, int)
    
    is_relevant = model.check_relevant(questions[question_index], answer)

    if is_relevant == 0:
        return jsonify(result = False,response='The answer looks irrelevant to the question!\n'+ questions[question_index])
    else:
        if question_index < 1:
            return jsonify(result=True, response=questions[question_index+1])
        else:
            return jsonify(result=True,response='Thank you for your feedback! We appreciate this')

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False) 
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)
