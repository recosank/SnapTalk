import jwt from "jsonwebtoken";

export default function authg(token) {
  const SECRET =
    "asjkdfa5s4df658ar64f3a54f5425253456544@#%@%^%$^!#$%@#zbsdfbsdfbdsafgb3847tw4y8hgf";
  try {
    console.log("lets decode stuff");
    let decodedData;
    decodedData = jwt.verify(token, SECRET);
    console.log(decodedData);

    return decodedData;
  } catch (error) {
    console.log(error.name);
    if (error.name === "TypeError") {
      console.log("nope");
    } else {
      console.log(error);
    }
  }
}
