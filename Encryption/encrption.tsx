import Aes from "react-native-aes-crypto";
export const generateKey = async (password: string, salt: string, cost: number, length: number) => {
  try {
    const key = await Aes.pbkdf2(password, salt, cost, length, "sha256");
    return key;
  } catch (error) {
    console.error("Error generating key: ", error);
  }
};

export const encryptData = async (text: string, key: string) => {
  try {
    const iv = await Aes.randomKey(16);
    const cipher = await Aes.encrypt(text, key, iv, "aes-256-cbc");
    return { cipher, iv };
  } catch (error) {
    console.error("Error encrypting data: ", error);
  }
};

export const decryptData = async (cipher: string, key: string, iv: string) => {
  try {
    const text = await Aes.decrypt(cipher, key, iv, "aes-256-cbc");
    return text;
  } catch (error) {
    console.error("Error decrypting data: ", error);
  }
};
