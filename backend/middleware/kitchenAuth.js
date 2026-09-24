import jwt from "jsonwebtoken";

const kitchenAuth = async (req, res, next) => {
  const { kitchentoken } = req.headers;

  if (!kitchentoken) {
    return res
      .status(401)
      .json({ success: false, message: "Kitchen login required" });
  }

  try {
    const tokenDecode = jwt.verify(kitchentoken, process.env.JWT_SECRET);
    const isKitchenToken =
      tokenDecode?.id === "kitchen" &&
      tokenDecode?.email === process.env.KITCHEN_EMAIL;

    if (!isKitchenToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid kitchen credentials" });
    }

    req.kitchen = tokenDecode;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default kitchenAuth;
