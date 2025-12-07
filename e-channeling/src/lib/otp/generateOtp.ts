export const generateOtp = (length: number = 6) =>
    [...Array(length)].map(() => Math.floor(Math.random() * 10)).join("");
