//hash value
import bcrypt from "bcrypt";

import { env } from "../../config/env.local";
const saltRounde = parseInt(env.SALT_ROUND!);

export const hashValue = async (value: string) => {
    await bcrypt.hash(value, saltRounde);
}
export const compareValue = async ({ value, hash }: { value: string, hash: string }) => {
    await bcrypt.compare(value, hash);
}