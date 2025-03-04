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

@app.route('/process', methods=['POST'])
def process():
    prompt = request.form.get('prompt', '')
    mood = request.form.get('mood', 'happy')
    context = request.form.get('context', '')  # Default to empty context
    file = request.files.get('file')

    # If a file is uploaded, convert it to text
    if file:
        filename = file.filename
        _, filename_extension = os.path.splitext(filename.lower())

        if filename_extension == '.pdf':
            file_content = convert_pdf_to_txt(file)
            context = file_content
        else:
            context = file.read().decode('utf-8')

    # Store user messages and AI responses in the session
    if 'chat_history' not in session:
        session['chat_history'] = []

    session['chat_history'].append({'user': prompt, 'context': context})

    # Call the AI model
    response, tokens_used, time_taken, model_used = get_resp(prompt, context, session['chat_history'], mood)

    # Store AI response in the session
    session['chat_history'].append({'ai': response})

    response_html = mistune.html(response)

    return jsonify({
        "response": response_html,
        "tokens_used": tokens_used,
        "time_taken": time_taken,
        "model_used": model_used,
    })

if __name__ == '__main__':
    app.run(debug=True)
