function Header(){


    const handlePrevLinksBtn = () =>{
        const cont = document.querySelector(".prev-links-list-cont")
        if(cont.style.width == "0px"){
            cont.style.width = "500px"
        }else{
            cont.style.width = "0px"
        }

    }

    return(
        <header>
            <h1 className="appName">BinRL</h1>

            <div className="navLinks">
                <div onClick={handlePrevLinksBtn}>Your Links</div>
                <div>LinkDir</div>
            </div>

            <div className="prev-links-list-cont">
                <div className="close-btn" onClick={handlePrevLinksBtn}>&times;</div>
                <div className="prev-link">
                    Actual Link:
                    <div className="actual-link">www.google.com</div>
                    Shortened Link:
                    <div className="shortened-link">comprl.web.app/short</div>
                </div>
                <div className="prev-link">
                    Link1
                </div>
            </div>


        </header>
    )

}

export default Header