import bcrypt from "bcryptjs";

const BackendBaseUrl = "http://localhost:8080";
const BackendApiUrl = `${BackendBaseUrl}/api/v1`;



const buff_to_base64 = (buff) => btoa(
  new Uint8Array(buff).reduce(
    (data, byte) => data + String.fromCharCode(byte), ''
  )
);

const base64_to_buf = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));

const enc = new TextEncoder();
const dec = new TextDecoder();

const getPasswordKey = (password) =>
  window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (passwordKey, salt, keyUsage) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

async function encryptData(secretData, password) {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      enc.encode(secretData)
    );

    const encryptedContentArr = new Uint8Array(encryptedContent);
    let buff = new Uint8Array(
      salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
    );
    buff.set(salt, 0);
    buff.set(iv, salt.byteLength);
    buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
    const base64Buff = buff_to_base64(buff);
    return base64Buff;
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}

async function decryptData(encryptedData, password) {
  try {
    const encryptedDataBuff = base64_to_buf(encryptedData);
    const salt = encryptedDataBuff.slice(0, 16);
    const iv = encryptedDataBuff.slice(16, 16 + 12);
    const data = encryptedDataBuff.slice(16 + 12);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      data
    );
    return dec.decode(decryptedContent);
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}

export async function decryptURL(encryptedData, password) {
    const decryptedData = await decryptData(encryptedData, password);
    return decryptedData
}


export async function checkPSWD(enteredPSWD, hasedPassword){
    
    try {
        const isMatch = await bcrypt.compare(enteredPSWD, hasedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }

}



export async function getURLbyID(id) {
    try{
        
        const response = await fetch(`${BackendApiUrl}/u/${id}`)

        const data = await response.json();

        return data
    }catch(e){
        console.error("Error retrieving the URL ", e)
    }
    
}



export async function getShortenedUrlAPI(longUrl) {
    try{

        const reqBody = {
            long_url: longUrl
        }
        const response = await fetch(`${BackendApiUrl}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });


        const data = await response.json();
        return data.shortUrl;
    }catch (e) {
        console.error("Error adding document: ", e);
    }   

}


export async function getShortenedUrlCust(longUrl, customUrl, password) {

    try{
        let reqBody
        if(password){
            const hashedPswd = await bcrypt.hash(password, 10)
            const encodedUrl = await encryptData(longUrl, password).then(data =>{return data})
            reqBody = {
                long_url : encodedUrl,
                customSlug: customUrl,
                password : hashedPswd
            }
        }else{
            reqBody = {
                long_url : longUrl,
                customSlug: customUrl
            }            
        }
        
        const response = await fetch(`${BackendApiUrl}/shortencustom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })

        const data = await response.json();
        return data.shortUrl;

    }catch (e) {
        console.error("Error adding document: ", e);
    }

}


export async function getShortenedUrlWPswd(longUrl, password) {
    
    const hashedPswd = await bcrypt.hash(password, 10);

    const encodedUrl = await encryptData(longUrl, password).then(data =>{
        return data
    })

    const body = {
        longUrl : encodedUrl,
        password : hashedPswd
    }

    console.log(body, password, longUrl)

    const response = await fetch(`${BackendApiUrl}/shorten`,{
        method:'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json();
    return data.shortUrl;
}

export async function getShortenedUrlAI(longUrl, password) {

    try{
        let reqBody
        if(password){
            const hashedPswd = await bcrypt.hash(password, 10)
            const encodedUrl = await encryptData(longUrl, password).then(data =>{return data})
            reqBody = {
                longUrl : encodedUrl,
                password : hashedPswd
            }
        }else{
            reqBody = {
                longUrl : longUrl
            }            
        }

        const response = await fetch(`${BackendApiUrl}/shortenai`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })

        const data = await response.json();
        console.log(data)
        return data.shortUrl

    }catch(e){
        console.error("Oops there was some error ", e)
    }
}



export async function createNewLinkDir(linkDirName, linkDirDesc, links, userId) {
    try {

        const body = {
            linkDirName: linkDirName,
            linkDirDesc: linkDirDesc,
            links: links,
            userId: userId
        }


        const response = await fetch(`${BackendApiUrl}/linkdir/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        
        const data = await response.text();

        console.log("Response:", data);
        
        return data;

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export async function modifyLinkDir(linkDirData) {
    try {

        console.log("Rcvd Dtaa: ", linkDirData)
        const response = await fetch(`${BackendApiUrl}/linkdir/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(linkDirData)
        })

        
        const data = await response.text();

        console.log("Response:", data);
        
        return data;

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export async function getAllLinkDir(userID){

    const body = {
        userId: userID
    }

    const urlQueryParams = new URLSearchParams(body).toString();

    const response = await fetch(`${BackendApiUrl}/linkdir/all?${urlQueryParams}`)

    const data = await response.json();
    return data;

}



export async function getLinkDir(linkDirId) {
    const response = await fetch(`${BackendApiUrl}/l/${linkDirId}`)

    const data = await response.json();

    return data;
}

