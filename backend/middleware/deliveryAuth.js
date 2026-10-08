import jwt from "jsonwebtoken";

const deliveryAuth = (req, res, next) => {
  const token = req.headers.deliverytoken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Delivery staff login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deliveryEmail = process.env.DELIVERY_EMAIL?.trim().toLowerCase();
    if (
      !deliveryEmail ||
      decoded?.id !== "delivery" ||
      decoded?.email !== deliveryEmail
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid delivery staff credentials" });
    }

    req.delivery = decoded;
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired delivery login" });
  }
};

export default deliveryAuth;
