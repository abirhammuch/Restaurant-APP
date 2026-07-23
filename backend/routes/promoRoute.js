import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";
import {
  createPromo,
  getPromos,
  updatePromo,
  deletePromo,
  validatePromo,
} from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.get("/list", adminAuth, getPromos);
promoRouter.post("/add", adminAuth, createPromo);
promoRouter.put("/edit", adminAuth, updatePromo);
promoRouter.delete("/delete", adminAuth, deletePromo);
promoRouter.post("/validate", userAuth, validatePromo);

export default promoRouter;
