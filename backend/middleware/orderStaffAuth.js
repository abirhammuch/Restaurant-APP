import jwt from "jsonwebtoken";

const orderStaffAuth = async (req, res, next) => {
  const adminToken = req.headers.admintoken;
  const kitchenToken = req.headers.kitchentoken;

  try {
    if (adminToken) {
      const admin = jwt.verify(adminToken, process.env.JWT_SECRET);
      if (admin?.id === "admin" && admin?.email === process.env.ADMIN_EMAIL) {
        req.admin = admin;
        return next();
      }
    }

    if (kitchenToken) {
      const kitchen = jwt.verify(kitchenToken, process.env.JWT_SECRET);
      if (
        kitchen?.id === "kitchen" &&
        kitchen?.email === process.env.KITCHEN_EMAIL
      ) {
        req.kitchen = kitchen;
        return next();
      }
    }
  } catch (error) {
    // Fall through to one consistent response for either invalid staff token.
  }

  return res
    .status(401)
    .json({ success: false, message: "Staff login required" });
};

export default orderStaffAuth;
