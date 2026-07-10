import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const { admintoken } = req.headers;

  if (!admintoken) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(admintoken, process.env.JWT_SECRET);

    const isAdminToken =
      tokenDecode?.id === "admin" &&
      tokenDecode?.email === process.env.ADMIN_EMAIL;

    if (!isAdminToken) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized Login Again" });
    }

    req.admin = tokenDecode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default adminAuth;
