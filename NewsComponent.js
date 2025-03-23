import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";  // Flask API URL

const NewsComponent = ({ companyName }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState(null);
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/get_news?company=${companyName}`);
                setNews(response.data.news);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [companyName]);

    const speakText = (text) => {
        if ("speechSynthesis" in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "hi-IN";  
            window.speechSynthesis.speak(speech);
        } else {
            alert("❌ आपका ब्राउज़र TTS सपोर्ट नहीं करता!");
        }
    };
    const handleTextToSpeech = async (text) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("❌ TTS request failed");
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>🔴 समाचार सारांश</h2>
            {loading ? <p>🔄 न्यूज़ लोड हो रही है...</p> : (
                news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index}>
                            <h3>{article.title}</h3>
                            <p>{article.summary}</p>
                            
                            {/* 🔊 ब्राउज़र TTS */}
                            <button onClick={() => speakText(article.summary)}>🔊 Listen (Browser)</button>

                            {/* 🎤 Flask TTS */}
                            <button onClick={() => handleTextToSpeech(article.summary)}>🎤 Listen (Flask)</button>

                            <hr />
                        </div>
                    ))
                ) : (
                    <p></p>
                )
            )}

            {/* अगर Flask से ऑडियो मिला तो प्लेयर दिखाएं */}
            {audioUrl && <audio controls src={audioUrl} />}
        </div>
    );
};

export default NewsComponent;
