import { useEffect, useState } from "react"
import PrevLinksTemp from "./PrevLinksTemp"
import { Link } from "react-router-dom"


function Header(props){

    const [linkshistory, setHistory] = useState([])
    const [sideHistoryBar, setSideHitoryBar] = useState(false)

    const [subText, setSubText] = useState("")

    useEffect(()=>{
        if(props.subText != ""){
            setSubText(props.subText)
            console.log(subText)
        }
    }, [])

    useEffect(()=>{
        // localStorage.clear()
    
        if(localStorage.length > 0){
            // console.log(localStorage)
            let temp = localStorage.getItem("linkhistory")
            temp = JSON.parse(temp)
            setHistory(temp)

        }else{
            // let temp = [
            //     {
            //         actual : "google.com",
            //         short : "comprl.com/wsdd",
            //         password : null
            //     }, {
            //         actual : "google.com",
            //         short : "comprl.com/wsdd",
            //         password : null
            //     }
            // ]
            
            localStorage.setItem("linkhistory", JSON.stringify([]))
            // localStorage.setItem("shortnedLinks", JSON.stringify(temp))
            // localStorage.setItem("passwords", JSON.stringify(temp))
        }
    }, [sideHistoryBar])


    const clearLocalStorage = async()=>{
        localStorage.clear()
    }



    const handlePrevLinksBtn = () =>{
        const cont = document.querySelector(".prev-links-list-cont")
        if(cont.style.width == "0px"){
            setSideHitoryBar(true)
            cont.style.width = 500 > window.innerWidth ? "100vw" : "500px"
        }else{
            setSideHitoryBar(false)
            cont.style.width = "0px"
        }

    }

    return(
        <header>
            <h1 className="appName">BinRL</h1>

            <div className="navLinks">
                <div onClick={handlePrevLinksBtn}>Your Links</div>
                <Link to={"/links"}><div>LinkDir</div></Link>
            </div>

            <div className="prev-links-list-cont">
                <div className="prev-list-header">
                    <h3 className="prv-list-text">History</h3>
                    <div className="close-btn" onClick={handlePrevLinksBtn}>&times;</div>
                </div>
                {
                linkshistory ? (
                    linkshistory.reverse().map((element, index) => (
                    <PrevLinksTemp
                        key={index}
                        actual={element.actual}
                        shortened={element.short}
                        password={null}
                        copyFunc = {async ()=>navigator.clipboard.writeText(element.short)}
                    />
                    ))
                ) : (
                    <></>
                )
                }

                
                {/* <div className="prev-link">
                    Actual Link:
                    <div className="i-blk actual-link-cont">
                        <div className="actual-link">
                            www.google.com/sdsdefcesce2sdsxwesccscscfedssdsdsfedfdcdcdcefefedsdsxsded
                        </div>
                    </div>
                    Shortened Link:
                    <div className="i-blk shortened-link-cont">
                        <div className="shortened-link">
                            comprl.web.app/short3ddsdsfsdfsdsdsfdffdcddsew23e
                        </div>
                        <div className="copyBtn-list">Copy</div>
                    </div>

                    Password:
                    <div className="i-blk link-pswd">
                        <input className="prev-list-link-pswd" value={"comprl.web.app/short"} readOnly/>
                        <div className="show-hide-btn copyBtn-list">Show</div>
                    </div>
                </div> */}

                                {
                linkshistory ? (
                    <div className="clear-history-btn-cont">
                        <div className="clear-history-btn" onClick={clearLocalStorage}>
                            Clear
                        </div>
                    </div>
                ) : (
                    <></>
                )
                }

  

            </div>


        </header>
    )

}

export default Header