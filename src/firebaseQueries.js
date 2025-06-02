import { db } from "./firebase";
import { addDoc, collection, setDoc, doc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";



// for large strings, use this from https://stackoverflow.com/a/49124600
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

export async function getShortenedUrlCP(longUrl, password, customUrl) {

    try{
        const hasedURLPassword = await bcrypt.hash(password, 10)


        let encryptedURL
        await encryptData(longUrl, password).then((data) => {
            // console.log("Encrypted data:", data);
            encryptedURL = data;
        }).catch((error) => { 
            console.error("Error encrypting data:", error);
        })

        const docRef = await setDoc(doc(db, "URLcenter", customUrl), {
            url : encryptedURL,
            password: hasedURLPassword,
        });
        console.log("Document written with ID: ", docRef);

    }catch (e) {
        console.error("Error adding document: ", e);
    }

}


export async function getShortenedUrlP(longUrl, password) {

    try{
        const hasedURLPassword = await bcrypt.hash(password, 10)


        // Encrypt
        let encryptedURL
        await encryptData(longUrl, password).then((data) => {
            // console.log("Encrypted data:", data);
            encryptedURL = data;
        }).catch((error) => { 
            console.error("Error encrypting data:", error);
        })

        console.log(encryptedURL); 

        // await decryptData(ciphertext, password).then((data) => {
        //     console.log("DEcrypted data:", data);
        //     // ciphertext = data;
        // }).catch((error) => { 
        //     console.error("Error encrypting data:", error);
        // })

        const docRef = await addDoc(collection(db, "URLcenter"), {
            url : encryptedURL,
            password: hasedURLPassword,
        })
        console.log("Document written with ID: ", docRef);
        return docRef.id;
    }catch (e) {
        console.error("Error adding document: ", e);
    }   

}

export async function getShortenedUrl(longUrl) {
    try{
        const docRef = await addDoc(collection(db, "URLcenter"), {
            url : longUrl,
            password: "",
        })
        console.log("Document written with ID: ", docRef);
        return docRef.id;

    }catch (e) {
        console.error("Error adding document: ", e);
    }   

}


export async function isPasswordProtected(id) {
    const docRef = doc(db, "URLcenter", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        if (docSnap.data().password !== ""){
            return true;
        } else {
            return false;
        }
    } else {
        console.log("No such document!");
    }

}

export async function redirectURL(id) {
    const docRef = doc(db, "URLcenter", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        console.log("No such document!");
    }

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

export async function decryptURL(encryptedData, password) {
    const decryptedData = await decryptData(encryptedData, password);
    return decryptedData
}