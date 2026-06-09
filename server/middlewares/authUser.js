import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = { _id: decoded.id };


    next();
  } catch (error) {
    return res.json({ success: false });
  }
};

export default authUser;







