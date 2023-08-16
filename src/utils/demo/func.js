// generate RSA key
export const generateRSAKey = () => {
  const min = 100000000000; // Minimum 12-digit number
  const max = 999999999999; // Maximum 12-digit number
  const rsaKey = Math.floor(Math.random() * (max - min + 1)) + min;
  return rsaKey.toString();
};
