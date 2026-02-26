import { useEffect, useState } from "react";
import Header from "./Header";
import URLShortener from "./URLShortener";
import { v4 as uuidv4 } from 'uuid';


function Home() {

  const [userID, setUserID] = useState("")

  useEffect(()=>{
    if(!localStorage.getItem("userID")){
      
      const userIDTemp = uuidv4()
      localStorage.setItem("userID", userIDTemp)
      setUserID(userIDTemp)
    }else{
      setUserID(localStorage.getItem("userID"))
    }
    // console.log(localStorage.getItem("userID"))
  }, [])


  return (
    <div className="urlShortPage">

        <Header subText={"Shortner"}/>
        <URLShortener />
      
    </div>
  );
}

export default Home