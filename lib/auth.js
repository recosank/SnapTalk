import jwt from "jsonwebtoken";

export default function authg(token) {
  const SECRET = process.env.JWT_SECRET;

  try {
    let decodedData;
    decodedData = jwt.verify(token, SECRET);
    return decodedData;
  } catch (error) {
    if (error.name === "TypeError") {
    } else {
      console.log(error);
    }
  }
}
