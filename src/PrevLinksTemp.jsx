function PrevLinksTemp(props){


    
    const togglePSWDvisib = () =>{
        const inputCont = document.querySelector(".prev-list-link-pswd")
        const hint = document.querySelector(".show-hide-btn")
        if(inputCont.type == "password"){
            inputCont.type = "text"
            hint.innerHTML = "Hide"
        }else{
            inputCont.type = "password"
            hint.innerHTML = "Show"

        }
    }


    const copyToClipboard = () => {
        navigator.clipboard.writeText("some")
            .then(() => {
                document.querySelector(".copyBtn-list").innerText = "Copied!";
                setTimeout(() => {
                    document.querySelector(".copyBtn-list").innerText = "Copy";
                }, 4000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    }
    

    return(

        props.password ?

            <div className="prev-link">
                Actual Link:
                <div className="i-blk actual-link-cont">
                    <div className="actual-link">
                        {props.actual}
                    </div>
                </div>
                Shortened Link:
                <div className="i-blk shortened-link-cont">
                    <div className="shortened-link">
                        {props.shortened}
                    </div>
                    <div className="copyBtn-list" onClick={copyToClipboard}>Copy</div>
                </div>

                Password:
                <div className="i-blk link-pswd">
                    <input className="prev-list-link-pswd" value={props.password} readOnly/>
                    <div className="show-hide-btn copyBtn-list" onClick={togglePSWDvisib}>Show</div>
                </div>

            </div> :
            <div className="prev-link">
                Actual Link:
                <div className="i-blk actual-link-cont">
                    <div className="actual-link">
                        {props.actual}
                    </div>
                </div>
                Shortened Link:
                <div className="i-blk shortened-link-cont">
                    <div className="shortened-link">
                        {props.shortened}
                    </div>
                    <div className="copyBtn-list" onClick={copyToClipboard}>Copy</div>
                </div>

            </div>


    )
}

export default PrevLinksTemp