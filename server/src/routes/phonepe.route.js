import { Router } from "express";
import { initiatePayment, checkStatus, callback, webhook } from "../controllers/phonepe.controller.js";

const router = Router();

router.route('/initiate-payment').post(initiatePayment);
router.route('/check-status').post(checkStatus);
router.route('/callback').post(callback);
router.route('/webhook').post(webhook);

export default router;