import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";  // Flask API URL

export const fetchNews = async (companyName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_news?company=${companyName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return null;
    }
};
const speakText = (text) => {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';  // हिंदी भाषा सेट करें
        window.speechSynthesis.speak(speech);
    } else {
        alert('Your browser does not support text-to-speech!');
    }
};

// बटन पर क्लिक इवेंट
<button onClick={() => speakText("यह न्यूज़ हिंदी में सुनें")}>🔊 Listen</button>
