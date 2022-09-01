import jwt from "jsonwebtoken";

export default function authg(token) {
  const SECRET =
    "asjkdfa5s4df658ar64f3a54f5425253456544@#%@%^%$^!#$%@#zbsdfbsdfbdsafgb3847tw4y8hgf";
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
