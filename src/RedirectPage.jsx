import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
// import { useNavigate } from "react-router-dom"
import { redirectURL, checkPSWD, decryptURL } from "./firebaseQueries"

function Page(){

    const { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [isProtected, setIsProtected] = useState(false)
    const [password, setPassword] = useState("")
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    // const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("URL Shortened");
    }

    const handleURLpswdSubmit = async (e) => {
        
        const password = document.querySelector(".URLpswdinput").value;
        
        const check = await checkPSWD(password, data.password)

        console.log(`checking => ${check}`)

        if(check){
            console.log(data.url);
            let redirectURL
            await decryptURL(data.url, password)
                .then((decryptedURL) => {
                    console.log("decrypting")
                    redirectURL = decryptedURL;
                    console.log(redirectURL)
                })
                .catch((error) => {
                    console.error("Error decrypting URL:", error);
                    setError("Failed to decrypt the URL. Please try again.");
                    return;
                });
            console.log(redirectURL);
            // setTimeout(()=>{

            window.location.href = `${redirectURL}`;
            // },10000)
        }else{
            setError("Incorrect password. Please try again.");
        }
        
    }

    useEffect(() => {
        // window.location.href = `//google.com`;
        redirectURL(id)
            .then((data) => {
                if(data){
                    if (data.password !== null) {
                        // console.log("This URL is password protected");
                        setIsProtected(true);
                        setData(data)
                        setLoading(false);
                    }else{
                        
                        if(!data){
                            setLoading(false)
                        }
                        window.location.href = data.url;
                    }
                }else{
                    setLoading(false)
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
        <div className="urlShortener">
            <div className="urlShortener-i-cont">
            <h1>Oops..Error</h1>
            </div>
        </div>
       )
    )
}

export default Page