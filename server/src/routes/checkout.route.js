import { Router } from "express";
import { submitCheckout } from "../controllers/checkout.controller.js";

const router = Router();

router.route("/submit").post(submitCheckout);

export default router;