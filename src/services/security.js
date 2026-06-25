import CryptoJS from 'crypto-js'


// Función para cifrar un mensaje
export async function encryptId(id) {
  let info = await getSecretKey()
  const secretKey = info?.success?.id || null
  const encrypted = CryptoJS.AES.encrypt(id, secretKey)
  return encodeURIComponent(encodeURIComponent(encrypted.toString()))
}

// Función para descifrar un mensaje
export async function decryptId(encryptedId) {
  // Decodificar y desencriptar
  let info = await getSecretKey()
  const secretKey = info?.success?.id || null
  const decodedEncryptedString = decodeURIComponent(decodeURIComponent(encryptedId))
  const decrypted = CryptoJS.AES.decrypt(decodedEncryptedString, secretKey)
  return decrypted.toString(CryptoJS.enc.Utf8)
}






const getSecretKey = async () => {
  const response = await fetch(`https://hospitalmetropolitano.org/api/auth/secret-key`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'No se pudo iniciar sesión en CVOX')
  }

  return json
}