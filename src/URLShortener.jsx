import { useEffect, useState } from "react";
import { getShortenedUrl, getShortenedUrlP, getShortenedUrlCP, getShortenedUrlCust } from "./firebaseQueries";

import { getShortenedUrlAI, getShortenedUrlAPI, getShortenedUrlWPswd } from "./BackendQueries";

function URLShortener(){

    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [customUrl, setCustomUrl] = useState(false);
    const [passwordurl, setPasswordurl] = useState(false);
    const [aisluggen, setAisluggen] = useState(false);

    // useEffect(() => {
    //     getShortenedUrlAPI("https://www.google.com").then((data)=>{
    //         console.log("Backend API Test Shortened URL: ", data);
    //     }).catch((e)=>{
    //         console.error("Error in Backend API Test: ", e);
    //     })
    // })
    

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("URL Shortened");
    }

    const handlecustURL = (e) => {
        if(customUrl){
            setCustomUrl(false);
            // console.log("Custom URL Disabled");
            document.querySelector(".URLblk").style.backgroundColor = "transparent";
        }else{
            // console.log("Custom URL Enabled");
            document.querySelector(".URLblk").style.backgroundColor = "#3a7bd5";
            setCustomUrl(true);
        }
    }

    const handlepswdURL = (e) => {
        if(passwordurl){
            setPasswordurl(false);
            // console.log("Password URL Disabled");
            document.querySelector(".pswdBLK").style.backgroundColor = "transparent";
        }else{
            // console.log("Password URL Enabled");
            document.querySelector(".pswdBLK").style.backgroundColor = "#3a7bd5";
            setPasswordurl(true);
        }
    }

    const makeitnew = (e) =>{
        setShortenedUrl("")
    }

    const handleAIURL = (e) => {
        // aisluggenbtn = document.querySelector(".aislugop")
        if(aisluggen){
            setAisluggen(false);
            document.querySelector(".aislugop").style.backgroundColor = "transparent";
            document.querySelector(".URLblk").style.display = "block";
        }else{
            setAisluggen(true);
            document.querySelector(".aislugop").style.backgroundColor = "#3a7bd5";
            document.querySelector(".URLblk").style.display = "none";
        }
    }

    const handleSlugGenMethod = (e) => {
        const method = e.target.value;
        if(method === "custom"){
            setCustomUrl(true);
            setAisluggen(false);
        } else if (method === "ai"){
            setAisluggen(true);
            setCustomUrl(false);
        }else {
            setCustomUrl(false);
            setAisluggen(false);
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

        document.getElementById("urlshortensubmitbtn").disabled = true;

        const givenURL = document.querySelector(".URLinput").value;
        const pswdCont = document.querySelector(".customURL-i-cont input[type='password']")
        const custCont = document.querySelector(".customURL-i-cont input")

        let shortenedURL, pswd
        if(givenURL === ""){
            alert("Where is the Looooonnnngggg URL?")
            document.querySelector(".URLinput").style.outline="1px solid red"
            document.querySelector(".URLinput").style.outlineOffset="-1px"
            setTimeout(()=>{
                document.querySelector(".URLinput").style.outline="none"
            },3000)
            return 
        }else{
            if(!(URL.canParse(givenURL))){
                alert("Not a valid URL :|")
                return
            }
        }

        if(passwordurl && pswdCont.value === ""){
            pswdCont.style.borderBottom = "1px solid red"
            alert("Password field cant be empty..")
            setTimeout(()=>{
                pswdCont.style.borderBottom = "1px solid #ffffff"
            },3000)
            return
        }

        if(customUrl){
            let custVal = custCont.value
            if(custVal === ""){
                custCont.style.borderBottom = "1px solid red"
                alert("Enter the custom alias")
                setTimeout(()=>{
                    custCont.style.borderBottom = "1px solid #ffffff"
                },3000)
                return

            }

            if(custVal.length < 5){
                alert("Custom Alias must be minimum 5 characters")
                return 
            }

            if(custVal == "linkdir" || custVal == "links"){
                alert("The alias `links` is reserved")
                return
            }

            const illegalChar = ["/", ".", "@", "#", "*", "&", "?", "(", ")", "=", ":", ";", "<",">", "{", "}", "[", "]"]

            for(let i of illegalChar){
                if(custVal.includes(i)){
                    alert(`The alias cannot contain the character ${i}`)
                     return
                }
            }
           
        }

        setUrl(givenURL);
        // console.log(customUrl + " " + passwordurl + " " + aisluggen)
        try{
            if(customUrl && passwordurl != ""){
                const customURL = document.querySelector(".customURL-i-cont input").value;
                const password = document.querySelector(".customURL-i-cont input[type='password']").value;
                await getShortenedUrlCP(givenURL, password, customURL);
                setShortenedUrl("comprl.web.app/" + customURL);
                shortenedURL = `comprl.web.app/${customURL}`
                pswd = password
            }else if(aisluggen && passwordurl != ""){
                console.log("AI slug with Password")
            }else if(customUrl){
                const customURL = document.querySelector(".customURL-i-cont input").value;
                await getShortenedUrlCust(givenURL, customURL);
                setShortenedUrl("comprl.web.app/" + customURL);
                shortenedURL = `comprl.web.app/${customURL}`
            }else if(passwordurl){
                const password = document.querySelector(".customURL-i-cont input[type='password']").value;
                const ext = await getShortenedUrlWPswd(givenURL, password);
                setShortenedUrl(ext);
                shortenedURL = ext
            }else if(aisluggen){
                const ext = await getShortenedUrlAI(givenURL)
                setShortenedUrl(ext);
                shortenedURL = ext 
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

             document.getElementById("urlshortensubmitbtn").disabled = false;

        }catch(e){
            console.log('Sorrry there was an error. Oopss...')
        }

         document.getElementById("urlshortensubmitbtn").disabled = false;
    }

    return (
        <div className="urlShortener">
            <div className="urlShortener-i-cont">
                <h2>Shorten Your looonnnggg... URL</h2>
                <form className="urlShortenerForm" onSubmit={handleSubmit}>
                    <input className="URLinput" type="text" placeholder="Enter URL to shorten" onChange={makeitnew}/>
                    <button type="submit" id="urlshortensubmitbtn" onClick={handleURLshorten}>Shorten</button>
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
                        {/* <div className="URLblk extra-feature-block" onClick={handlecustURL}>Custom URL</div>
                        <div className="pswdBLK extra-feature-block" onClick={handlepswdURL}>Set Password</div>
                        <div className="aislugop extra-feature-block" onClick={handleAIURL}>AI Slug Gen</div> */}
                        <select className="extra-feature-block slug-mthd-btn" id="sluggenmethod" onChange={handleSlugGenMethod}>
                            <option defaultValue={"random"}>Random Slug</option>
                            <option value="custom">Custom Slug</option>
                            <option value="ai">AI Generated Slug</option>
                        </select>
                        {/* <div className="aislugop extra-feature-block" onClick={handleAIURL}>AI Slug Gen</div> */}
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