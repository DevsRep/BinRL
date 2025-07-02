import { useEffect, useState } from "react"
import Header from "./Header"
import { v4 as uuidv4 } from 'uuid';
import { Outlet } from "react-router-dom";


function LinksPage(){


    const [userID, setUserID] = useState("")
    

    useEffect(()=>{
        if(localStorage.getItem("userID") == ""){
        const userIDTemp = uuidv4()
        localStorage.setItem("userID", userIDTemp)
        setUserID(userIDTemp)
        }else{
        setUserID(localStorage.getItem("userID"))
        }
    }, [])

    return(
        <div className="linkDirPage">
            <Header subText={"LinkDir"}/>
            <Outlet />
        </div>
    )

}

export default LinksPage