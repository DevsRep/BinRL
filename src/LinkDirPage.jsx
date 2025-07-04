import { Link, Outlet } from "react-router-dom";
import Header from "./Header";

function LinkDirPage() {
    return (
        <div className="link-dir-page-cont">
            <div className="link-dir-page">
                {/* <Header /> */}
                <h3 className="linkdir-page-title">CompRL/</h3>

                <div className="empty-link-dir">
                    <p className="empty-link-dir-desc">Create a new LinkDir to get started</p>
                    <Link to={"/links/new"} style={{ textDecoration: "none" }}>
                        <div className="empty-link-dir-btn">
                            <h3>Create a new LinkDir</h3>
                        </div>
                    </Link>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default LinkDirPage