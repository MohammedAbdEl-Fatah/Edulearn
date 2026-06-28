import CryptoJS from "crypto-js";
import { env } from "../../config/env.local";

const keyCrypto = env.ENCRYPT_KEY!;

const encryptValue = (data: string): string => {
    return CryptoJS.AES.encrypt(data, keyCrypto).toString();
};

const decryptValue = (data: string): string => {
    if (!data) {
        return "";
    }
    try {
        const decryptoData = CryptoJS.AES.decrypt(data, keyCrypto).toString(CryptoJS.enc.Utf8);
        return decryptoData;
    } catch (error) {
        console.error("decryptValue: Decryption failed", error);
        return "";
    }
};

export { encryptValue, decryptValue };
