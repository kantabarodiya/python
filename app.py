from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import requests
from newspaper import Article
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app)  # React से API कॉल को अलाऊ करने के लिए

# ✅ अधिकतम फ़ाइल साइज़ 50MB सेट करें
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

# ✅ स्टैटिक फोल्डर बनाएँ (अगर मौजूद नहीं है)
if not os.path.exists("static"):
    os.makedirs("static")

# ✅ अलLOWED एक्सटेंशन्स सेट करें
ALLOWED_EXTENSIONS = {"zip", "pdf", "doc", "ppt", "xls", "png", "jpg", "mp3", "mp4"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 🔥 News Summarization API  
NEWS_API_KEY = "d245bb7e13be4a63b3343dc2b0bdea93"

@app.route('/get_news', methods=['GET'])
def get_news():
    company = request.args.get('company', 'Google')
    url = f"https://newsapi.org/v2/everything?q={company}&apiKey={NEWS_API_KEY}"
    
    response = requests.get(url)
    news_data = response.json()

    if news_data["status"] != "ok":
        return jsonify({"error": "Failed to fetch news"}), 500

    articles = news_data["articles"][:3]  # सिर्फ़ 3 आर्टिकल लेंगे
    summarized_news = []

    for article in articles:
        try:
            url = article["url"]
            news_article = Article(url)
            news_article.download()
            news_article.parse()
            news_article.nlp()  # NLP Summarization

            summarized_news.append({
                "title": news_article.title,
                "summary": news_article.summary,
                "url": url
            })
        except:
            continue

    return jsonify({"news": summarized_news})

# 🔊 Text-to-Speech (TTS) API
@app.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    audio_path = "static/news_audio.mp3"
    tts = gTTS(text, lang="hi")
    tts.save(audio_path)  

    return jsonify({"audio_url": f"http://127.0.0.1:5000/{audio_path}"})

# ✅ **GET और POST दोनों allow करने वाला Route**  
@app.route('/your_route', methods=['GET', 'POST'])  
def my_route():
    if request.method == 'POST':
        return jsonify({"message": "This is a POST request!"})
    return "Hello, this is your_route!"

# ✅ **फ़ाइल अपलोड API**
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        upload_

