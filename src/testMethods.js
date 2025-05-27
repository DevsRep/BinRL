import forge from 'node-forge';

export function encryptWithPassword(plaintext, password) {
  const encrypted = forge.pbe.encrypt(plaintext, password, {
    algorithm: 'AES-CBC'
  });
  return forge.util.encode64(encrypted);
}

export function decryptWithPassword(ciphertextBase64, password) {
  const encrypted = forge.util.decode64(ciphertextBase64);
  const decrypted = forge.pbe.decrypt(encrypted, password, {
    algorithm: 'AES-CBC'
  });
  return decrypted;
}
