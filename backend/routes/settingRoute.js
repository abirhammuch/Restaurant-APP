import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
} from "../controllers/settingController.js";

const settingRouter = express.Router();

settingRouter.get("/public", getPublicSettings);
settingRouter.get("/admin", adminAuth, getAdminSettings);
settingRouter.put("/admin", adminAuth, updateSettings);

export default settingRouter;
