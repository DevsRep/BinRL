import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { redirectURL, isPasswordProtected, checkPSWD, decryptURL } from "./firebaseQueries"

function Page(){

    const { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [isProtected, setIsProtected] = useState(false)
    const [password, setPassword] = useState("")
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("URL Shortened");
    }

    const handleURLpswdSubmit = async (e) => {
        
        const password = document.querySelector(".URLpswdinput").value;
        
        const check = await checkPSWD(password, data.password)

        // console.log(check)

        if(check){
            console.log("Password is correct");
            let redirectURL
            await decryptURL(data.url, password)
                .then((decryptedURL) => {
                    redirectURL = decryptedURL;
                })
                .catch((error) => {
                    console.error("Error decrypting URL:", error);
                    setError("Failed to decrypt the URL. Please try again.");
                    return;
                });
            console.log(redirectURL);
            window.location.href = `${redirectURL}`;
        }else{
            setError("Incorrect password. Please try again.");
        }
        
    }

    useEffect(() => {
        // window.location.href = `//google.com`;
        redirectURL(id)
            .then((data) => {
                if (data.password !== "") {
                    // console.log("This URL is password protected");
                    setIsProtected(true);
                    setData(data)
                    setLoading(false);
                }else{
                    window.location.href = data.url;
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    },[])


    return(
       loading ? (
        <div className="urlShortener">
            <div className="urlShortener-i-cont">
                <h2>Redirecting...</h2>
            </div>
        </div>
       ) : isProtected ? (
            <div className="urlShortener">
                <div className="urlShortener-i-cont">
                <h2>This URL is password protected</h2>
                {error ? <p style={{"color":"red"}}>{error}</p> : <></>}
                <form className="urlShortenerForm" onSubmit={handleSubmit}>
                    <input className="URLpswdinput" type="password" placeholder="Enter the URL password..."/>
                    <button type="submit" onClick={handleURLpswdSubmit}>Submit</button>
                </form>
                </div>
            </div>
       ) : (
        <div className="error">
            <h1>Error</h1>
        </div>
       )
    )
}

export default Page