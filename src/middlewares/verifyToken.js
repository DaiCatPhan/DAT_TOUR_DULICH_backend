import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      console.log("verify >>>>>>>>", data);
      if (err) {
        return res.status(403).json("Token is not valid !");
      }
      req.user = data;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export default verifyToken;
