from flask import Flask, request, jsonify
from api.groq import handle_prompt

app = Flask(__name__)

@app.route('/api/groq')
def groq_api():
    prompt = request.args.get('prompt', '')
    response = handle_prompt(prompt)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
