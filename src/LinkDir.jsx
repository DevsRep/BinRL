import { useEffect, useState } from "react"
// import { getLinkDir } from "./firebaseQueries"
import { getLinkDir } from "./BackendQueries";
import { useParams } from "react-router-dom"


function LinkDir(){

    const {id} = useParams();

    const [linkDirData, setLinkDirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchLinkDir = async () => {
        await getLinkDir(id)
            .then((linkDirData) => {
                console.log("LinkDir Data:", linkDirData);
                setLinkDirData(linkDirData);
                if(!linkDirData){
                    setError("LinkDir not found. Please check the ID and try again.");
                }
            })
        setLoading(false);
    }




    useEffect(()=>{
        document.querySelector(".empty-link-dir").style.display = "none"
        fetchLinkDir()
    }, [])

    return(
        !linkDirData || loading ? (
            <div className="link-dir-pre-load-info">
                <h2>Loading Link Directory...</h2>
            </div>
        ) : error ? (
            <div className="link-dir-pre-load-info">
                <div className="urlShortener-i-cont">
                <h1>Oops..{error}</h1>
                </div>
            </div>
        ) : (
            <div className="link-dir-cont">
                <div className="link-dir-info">
                    <h3>{linkDirData.linkDirName}</h3>
                    {linkDirData.linkDirDesc && <p>{linkDirData.linkDirDesc}</p>}
                </div>
                <div className="link-dir-links">

                    {/* <div className="link-item">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <div className="link-item-name">Looong URL</div>
                            <div className="link-item-url">https://www.google.com/maps/d/u/0/edit?mid=1cCsp9BVlGQDMRTYc7mbYZLD7kH0sCgU&ll=11.735940464310644%2C75.88320217946892&z=9</div>
                        </a>
                    </div> */}

                    {linkDirData.links.map(link => (
                        <div key={link.id} className="link-item">
                            <a href={link.linkURL} target="_blank" rel="noopener noreferrer">
                                <div className="link-item-name">{link.linkName}</div>
                                <div className="link-item-url">{link.linkURL}</div>
                            </a>
                        </div>
                    ))}

                    
                </div>
            </div>
        )
    )
}

export default LinkDir