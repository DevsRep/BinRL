import { Link } from "react-router-dom"

function LinkDirHome(){

    return(
        <div className="link-dir-list">

            <Link to={"/links/new"}>
                <div className="new-link-dir-cre-cont">
                    <h3>Create a new LinkDir</h3>
                    <p className="add-sign">+</p>
                </div>
            </Link>
        
        </div>
    )
}

export default LinkDirHome