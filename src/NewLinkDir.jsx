import { useState } from "react"

function NewLinkDir(){

    const [noLinks, setNoLinks] = useState(1)

    const [linkData, setLinkData] = useState([{linkName: "", linkURL: ""}])


    const addLink = () => {
        setNoLinks(noLinks + 1)
        setLinkData([...linkData, {linkName: "", linkURL: ""}])
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
            tempLinkData.splice(index, 1);
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

    return(
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
                                <label htmlFor={`linkName${index}`}>Link {index + 1} {noLinks >1 ? <span onClick={(index) => deleteLinkBlock(index)}>&times;</span> : <></>}</label>
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

                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default NewLinkDir