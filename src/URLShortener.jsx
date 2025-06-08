import { useState } from "react";
import { getShortenedUrl, getShortenedUrlP, getShortenedUrlCP } from "./firebaseQueries";

function URLShortener(){

    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [customUrl, setCustomUrl] = useState(false);
    const [passwordurl, setPasswordurl] = useState(false);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("URL Shortened");
    }

    const handlecustURL = (e) => {
        if(customUrl){
            setCustomUrl(false);
            console.log("Custom URL Disabled");
            document.querySelector(".URLblk").style.backgroundColor = "transparent";
        }else{
            console.log("Custom URL Enabled");
            document.querySelector(".URLblk").style.backgroundColor = "#3a7bd5";
            setCustomUrl(true);
        }
    }

    const handlepswdURL = (e) => {
        if(passwordurl){
            setPasswordurl(false);
            console.log("Password URL Disabled");
            document.querySelector(".pswdBLK").style.backgroundColor = "transparent";
        }else{
            console.log("Password URL Enabled");
            document.querySelector(".pswdBLK").style.backgroundColor = "#3a7bd5";
            setPasswordurl(true);
        }
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

    const handleURLshorten = async (e) => {
        const givenURL = document.querySelector(".URLinput").value;
        let shortenedURL, pswd
        setUrl(givenURL);
        try{
            if(customUrl && passwordurl){
                const customURL = document.querySelector(".customURL-i-cont input").value;
                const password = document.querySelector(".customURL-i-cont input[type='password']").value;
                await getShortenedUrlCP(givenURL, password, customURL);
                setShortenedUrl("comprl.web.app/" + customURL);
                shortenedURL = `comprl.web.app/${customURL}`
                pswd = password
            }else if(customUrl){
                const customURL = document.querySelector(".customURL-i-cont input").value;
                await getShortenedUrlCP(givenURL, "", customURL);
                setShortenedUrl("comprl.web.app/" + customURL);
                shortenedURL = `comprl.web.app/${customURL}`
            }else if(passwordurl){
                const password = document.querySelector(".customURL-i-cont input[type='password']").value;
                const ext = await getShortenedUrlP(givenURL, password);
                setShortenedUrl("comprl.web.app/" + ext);
                shortenedURL = `comprl.web.app/${ext}`
            }else{
                const ext = await getShortenedUrl(givenURL);
                setShortenedUrl("comprl.web.app/" + ext);
                shortenedURL = `comprl.web.app/${ext}`
            }

            const currentState = JSON.parse(localStorage.getItem("linkhistory"))
            currentState.push(
                {
                    actual : givenURL,
                    short : shortenedURL,
                    password : null
                }
            )

            localStorage.setItem("linkhistory", JSON.stringify(currentState))

            

        }catch(e){
            console.log('Sorrry there was an error. Oopss...')
        }

    }

    return (
        <div className="urlShortener">
            <div className="urlShortener-i-cont">
                <h2>Shorten Your looonnnggg... URL</h2>
                <form className="urlShortenerForm" onSubmit={handleSubmit}>
                    <input className="URLinput" type="text" placeholder="Enter URL to shorten"/>
                    <button type="submit" onClick={handleURLshorten}>Shorten</button>
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

                <div className="extra-features">
                    <div className="extra-features-i-cont">
                        <div className="URLblk extra-feature-block" onClick={handlecustURL}>Custom URL</div>
                        <div className="pswdBLK extra-feature-block" onClick={handlepswdURL}>Set Password</div>
                    </div>
                </div>

                {
                    customUrl ? 
                    <div className="customURL-cont">
                        Enter a custom URL Alias:
                        <div className="customURL-i-cont">
                            comprl.web.app/<input type="text" placeholder="Enter Custom URL" />
                        </div> 
                    </div>: <></>
                }

                {
                    passwordurl ? 
                    <div className="customURL-cont">
                        Enter a access password:
                        <div className="customURL-i-cont">
                            <input type="password" placeholder="Enter a password" />
                        </div> 
                    </div>: <></>
                }


            </div>
        </div>
    );


}

export default URLShortener;