// generate otp
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();// like 000000 6digit
}
export const generateOtpExpire = (time: number = 5) => {
    return new Date(Date.now() + time * 60 * 1000);//like time =10; => 10 minutes default 5 minites
}