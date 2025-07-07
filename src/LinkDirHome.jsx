import { Link } from "react-router-dom"
import { getAllLinkDir } from "./firebaseQueries"
import { useEffect, useState } from "react"

function LinkDirHome(){

    const [linkDirList, setLinkDirList] = useState([])

    
    const retriveData = async()=>{
        const tempData = await getAllLinkDir(localStorage.getItem("userID"))
        setLinkDirList(tempData)
    }


    useEffect(()=>{
        retriveData()
    }, [])

    useEffect(()=>{
        console.log(linkDirList)
    }, [linkDirList])



    return(
        <div className="link-dir-list">
            {
                linkDirList.length >= 0 ? 
                    linkDirList.map((element) => (
                        <div className="new-link-dir-cre-cont" key={element.linkDirName}>
                            <h3>{element.linkDirName}</h3>  
                        </div>
                    )) : <></>
            }

            <Link to={"/linkdir/new"}>
                <div className="new-link-dir-cre-cont">
                    <h3>Create a new LinkDir</h3>
                    <p className="add-sign">+</p>
                </div>
            </Link>
        
        </div>
    )
}

export default LinkDirHome