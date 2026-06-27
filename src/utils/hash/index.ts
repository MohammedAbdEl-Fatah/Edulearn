//hash value
import bcrypt from "bcrypt";

import { env } from "../../config/env.local";
const saltRounde = parseInt(env.SALT_ROUND!);

export const hashValue = async (value: string) => {
    return (await bcrypt.hash(value, saltRounde)).toString();
}
export const compareValue = async ({ value, hash }: { value: string, hash: string }) => {
    return await bcrypt.compare(value, hash);
}