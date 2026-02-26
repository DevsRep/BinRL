import { useEffect, useState } from "react"
// import { createNewLinkDir } from "./firebaseQueries"
import { getLinkDir, modifyLinkDir } from "./BackendQueries"


function LinkDirEdit(){

    const [noLinks, setNoLinks] = useState(1)
    const [loading, setLoading] = useState(false)

    const [linkData, setLinkData] = useState(null)

    const [linkDirId, setLinkDirId] = useState(null);

    useEffect(() => {

        const paramSearcher = new URLSearchParams(window.location.search);
        
        setLinkDirId(paramSearcher.get("id"))
        
    },[])


    const fetchLinkDirData = async (linkDirId) => {

        setLoading(true);

        if(linkDirId){
            const tempData = await getLinkDir(linkDirId);
            console.log("Fetched Link Directory Data:", tempData);
            if(tempData){
                setLinkData(tempData);
                setNoLinks(tempData.links ? tempData.links.length : 1);
            } else {
                console.error("No data found for Link Directory ID:", linkDirId);
            }
        } 

        console.log("Data", linkData)

        setLoading(false);
    }


    useEffect(()=>{

        fetchLinkDirData(linkDirId)

    },[linkDirId])

    const addLink = () => {
        if(noLinks < 20){
        setNoLinks(noLinks + 1)
        const temp = linkData
        temp.links = [...temp.links, {linkName: "", linkURL: ""}]
        setLinkData(temp)
        }else{
            alert("You can only add up to 20 links.");
        }
    }

    const handleLinkInputNameChange = (e, index)=>{
        const value = e.target.value;
        const tempLinkData = linkData;
        tempLinkData.links[index]["linkName"] = value;
        setLinkData(tempLinkData);
    } 

    const handleLinkInputURLChange = (e, index)=>{
        const value = e.target.value;
        const tempLinkData = linkData
        tempLinkData.links[index]["linkURL"] = value;
        setLinkData(tempLinkData);
    }

    const deleteLinkBlock = (index) => {
        if(linkData.links.length > 1){
            const tempLinkData = linkData;
            console.log("Deleting link at index:", index);
            console.log(tempLinkData.links.splice(index, 1))
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

        if(linkData.links.some(link => link.linkName.trim() === "" || link.linkURL.trim() === "")){
            alert("All link fields must be filled out.");
            setLoading(false);
            return;
        }

        const temp = linkData
        temp.linkDirName = linkDirName
        temp.linkDirDesc = linkDirDesc

        setLinkData(temp)

        
        await modifyLinkDir(temp)
            .then((linkDirId) => {
                console.log("LinkDir updated:", linkDirId);
                alert("Link Directory updated successfully!");
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
        linkDirId && linkData ?(
        <div className="new-link-dir-form-cont">

            <form className="new-link-dir-form" onSubmit={handleFormSubmit}>
                <h2>Create a new Link Directory</h2>
                <div className="form-details">
                    <label htmlFor="linkDirName">Link Directory Name:</label>
                    <input type="text" id="linkDirName" name="linkDirName" placeholder="Enter Link Directory Name" defaultValue={linkData.linkDirName} required />
                </div>

                <div className="form-details">
                    <label htmlFor="linkDirDesc">Description:</label>
                    <input type="text" id="linkDirDesc" name="linkDirDesc" placeholder="Enter Description (optional)" defaultValue={linkData.linkDirDesc}/>
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
                        linkData.links.map((link, index) => (
                            <div className="link-input" key={index}>
                                <label htmlFor={`linkName${index}`}>Link {index + 1} {noLinks >1 ? <span onClick={() => deleteLinkBlock(index)}>&times;</span> : <></>}</label>
                                <input type="text" name={`linkName${index}`} defaultValue={link.linkName} placeholder="Link Name" required onChange={(e)=>handleLinkInputNameChange(e, index)}/>
                                <input type="url" name={`linkURL${index}`} defaultValue={link.linkURL} placeholder="Link URL" required onChange={(e) => handleLinkInputURLChange(e, index)}/>
                            </div>
                        ))
                        }

                    {/* </div> */}

                    <div className="add-link-btn" onClick={addLink}>
                        Add another link +
                    </div>
                </div>

                <button type="submit" onClick={NewLinkDir}>Save Edits</button>
            </form>
        </div>):<p>No Link Directory to edit...</p>
    )
}

export default LinkDirEdit