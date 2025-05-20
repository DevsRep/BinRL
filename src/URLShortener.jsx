import { useState } from "react";


function URLShortener(){

    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("hello.com");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("URL Shortened");
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl)
            .then(() => {
                document.querySelector(".copyBtn").innerText = "Copied!";
                setTimeout(() => {
                    document.querySelector(".copyBtn").innerText = "Copy";
                }, 4000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    }

    return (
        <div className="urlShortener">
            <div className="urlShortener-i-cont">
                <h2>Shorten Your looonnnggg... URL</h2>
                <form className="urlShortenerForm" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter URL to shorten" />
                    <button type="submit">Shorten</button>
                </form>

                
                {
                shortenedUrl ? 
                <div className="urlShortenerResult">
                    <h3>Your Shortened URL is ready..</h3>
                    <div className="urlShortenerResult-i-cont">
                        <p>{shortenedUrl}</p>
                        <button className="copyBtn" onClick={copyToClipboard}>Copy</button>
                    </div>
                </div> : <></>

                }

            </div>
        </div>
    );


}

export default URLShortener;