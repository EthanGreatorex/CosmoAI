from flask import Flask, render_template, request, jsonify, session
from ai_model import get_resp
from pdf_to_text import convert_pdf_to_txt
import mistune
import os

app = Flask(__name__)
app.secret_key = 'ithinkcosmoisveryverycool'  # Replace with your secret key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clearcache', methods=['POST'])
def clearcache():
    session['chat_history'] = []
    return jsonify({"status": "cleared"})

@app.route('/get_chat_history', methods=['GET'])
def get_chat_history():
    return jsonify({"history": session.get('chat_history', [])})

@app.route('/process', methods=['POST'])
def process():
    prompt = request.form.get('prompt', 'no prompt')
    mood = request.form.get('mood', 'happy')
    context = request.form.get('context', '')
    name = request.form.get('name', '')
    length = request.form.get('length','short')
    if name.strip() == '':
        name = 'Secret User'
    file = request.files.get('file')

    if file:
        filename = file.filename
        _, filename_extension = os.path.splitext(filename.lower())

        if filename_extension == '.pdf':
            file_content = convert_pdf_to_txt(file)
            context = file_content
        else:
            context = file.read().decode('utf-8')

    if 'chat_history' not in session:
        session['chat_history'] = []

    if len(session['chat_history']) > 5:
        session['chat_history'] = session['chat_history'][-5:]

    response, tokens_used, time_taken, model_used = get_resp(
        prompt, context, session['chat_history'], mood, name, length
    )

    session['chat_history'].append({'role': 'user', 'message': prompt})
    session['chat_history'].append({'role': 'ai', 'message': response})
    session.modified = True  # Ensure session updates persist

    response_html = mistune.html(response)

    if response_html == '<p>Error</p>':
        response_html = 'Sorry! Too many tokens required.'

    return jsonify({
        "response": response_html,
        "tokens_used": tokens_used,
        "time_taken": time_taken,
        "model_used": model_used,
    })


if __name__ == '__main__':
    app.run(debug=True)
