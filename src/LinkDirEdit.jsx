import { useEffect, useState } from "react"
import { createNewLinkDir } from "./firebaseQueries"


function LinkDirEdit(){

    const [noLinks, setNoLinks] = useState(1)
    const [loading, setLoading] = useState(false)

    const [linkData, setLinkData] = useState([{linkName: "", linkURL: ""}])

    const [linkDirId, setLinkDirId] = useState(null);

    useEffect(() => {

        const paramSearcher = new URLSearchParams(window.location.search);
        
        setLinkDirId(paramSearcher.get("id"))
        
    },[])

    const addLink = () => {
        if(noLinks < 20){
        setNoLinks(noLinks + 1)
        setLinkData([...linkData, {linkName: "", linkURL: ""}])
        }else{
            alert("You can only add up to 20 links.");
        }
    }

    const handleLinkInputNameChange = (e, index)=>{
        const value = e.target.value;
        const tempLinkData = [...linkData];
        tempLinkData[index]["linkName"] = value;
        setLinkData(tempLinkData);
    } 

    const handleLinkInputURLChange = (e, index)=>{
        const value = e.target.value;
        const tempLinkData = [...linkData];
        tempLinkData[index]["linkURL"] = value;
        setLinkData(tempLinkData);
    }

    const deleteLinkBlock = (index) => {
        if(linkData.length > 1){
            const tempLinkData = [...linkData];
            console.log("Deleting link at index:", index);
            console.log(tempLinkData.splice(index, 1))
            setLinkData(tempLinkData);
            setNoLinks(noLinks - 1);
        } else {
            alert("You must have at least one link.");
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted with data:", {
            linkDirName: e.target.linkDirName.value,
            linkDirDesc: e.target.linkDirDesc.value,
            links: linkData
        });
    }

    const NewLinkDir = async () => {
        setLoading(true);
        const linkDirName = document.getElementById("linkDirName").value;
        const linkDirDesc = document.getElementById("linkDirDesc").value;

        if(linkDirName.trim() === ""){
            alert("Link Directory Name cannot be empty.");
            setLoading(false);

            return;
        }

        if(linkData.some(link => link.linkName.trim() === "" || link.linkURL.trim() === "")){
            alert("All link fields must be filled out.");
            setLoading(false);
            return;
        }
        
        await createNewLinkDir(linkDirName, linkDirDesc, linkData, localStorage.getItem("userID"))
            .then((linkDirId) => {
                console.log("New Link Directory created with ID:", linkDirId);
                alert("Link Directory created successfully!");
                // Optionally, redirect to the new Link Directory page
                window.location.href = `/linkdir`;
            })
            .catch((error) => {
                console.error("Error creating Link Directory:", error);
                alert("Failed to create Link Directory. Please try again.");
            })
        
        setLoading(false);

    }

    return(

        loading ? (
            <div className="link-dir-pre-load-info">
                <h2>Loading Link Directory...</h2>
            </div>
        ):
        linkDirId ?(
        <div className="new-link-dir-form-cont">

            <form className="new-link-dir-form" onSubmit={handleFormSubmit}>
                <h2>Create a new Link Directory</h2>
                <div className="form-details">
                    <label htmlFor="linkDirName">Link Directory Name:</label>
                    <input type="text" id="linkDirName" name="linkDirName" placeholder="Enter Link Directory Name" required />
                </div>

                <div className="form-details">
                    <label htmlFor="linkDirDesc">Description:</label>
                    <input type="text" id="linkDirDesc" name="linkDirDesc" placeholder="Enter Description (optional)" />
                </div>

                <div className="form-details">
                    <label htmlFor="linkDirDesc">Your Links:</label>

                    {/* <div className="link-inputs"> */}
                        {/* <div className="link-input">
                            <label htmlFor="linkName">Link {noLinks}</label>
                            
                            <input type="text" name="linkName" placeholder="Link Name" required />
                            <input type="url" name="linkURL" placeholder="Link URL" required />
                        </div> */}
                        {
                        linkData.map((link, index) => (
                            <div className="link-input" key={index}>
                                <label htmlFor={`linkName${index}`}>Link {index + 1} {noLinks >1 ? <span onClick={() => deleteLinkBlock(index)}>&times;</span> : <></>}</label>
                                <input type="text" name={`linkName${index}`} value={link.linkName} placeholder="Link Name" required onChange={(e)=>handleLinkInputNameChange(e, index)}/>
                                <input type="url" name={`linkURL${index}`} value={link.linkURL} placeholder="Link URL" required onChange={(e) => handleLinkInputURLChange(e, index)}/>
                            </div>
                        ))
                        }

                    {/* </div> */}

                    <div className="add-link-btn" onClick={addLink}>
                        Add another link +
                    </div>
                </div>

                <button type="submit" onClick={NewLinkDir}>Create</button>
            </form>
        </div>):<p>No Link Directory to edit...</p>
    )
}

export default LinkDirEdit