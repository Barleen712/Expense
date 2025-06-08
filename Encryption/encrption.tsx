import Aes from "react-native-aes-crypto";

export const generateKey = async (
  password: string | null | undefined,
  salt: string | null | undefined,
  cost: number,
  length: number
) => {
  if (!password || !salt) {
    console.log(password,salt)
    console.error("❌ Cannot generate key. Password or salt is null/undefined.");
    return null;
  }

  try {
    const key = await Aes.pbkdf2(password, salt, cost, length, "sha256");
    return key;
  } catch (error) {
    console.error("❌ Error generating key: ", error);
    return null;
  }
};

export const encryptData = async (text: string, key: string | null) => {
  if (!key) {
    console.error("❌ Cannot encrypt: key is null");
    return null;
  }

  try {
    const iv = await Aes.randomKey(16);
    const cipher = await Aes.encrypt(text, key, iv, "aes-256-cbc");
    return { cipher, iv };
  } catch (error) {
    console.error("❌ Error encrypting data: ", error);
    return null;
  }
};

export const decryptData = async (cipher: string, key: string | null, iv: string) => {
  if (!key) {
    console.error("❌ Cannot decrypt: key is null");
    return null;
  }

  try {
    const text = await Aes.decrypt(cipher, key, iv, "aes-256-cbc");
    return text;
  } catch (error) {
    console.error("❌ Error decrypting data: ", error);
    return null;
  }
};
