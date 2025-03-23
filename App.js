import React from "react";
import NewsComponent from "./NewsComponent";

function App() {
    return (
        <div>
            <h1>News Summarization & TTS</h1>
            <NewsComponent companyName="Tesla" />
            <NewsComponent />
        </div>
    );
}

export default App;

