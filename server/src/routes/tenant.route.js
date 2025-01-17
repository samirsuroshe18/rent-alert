import { Router } from "express";
import { addTenant, deleteTenant, editTenant, getCurrentUser, getTenants, loginUser, logoutUser, sendWhatsAppMessage } from "../controllers/tenant.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/add-tenant').post(upload.single("profile"), addTenant);
router.route('/get-tenants').get(getTenants);
router.route('/edit-tenants').put(upload.single("profile"), editTenant);
router.route('/delete-tenants').post(deleteTenant); 
router.route('/send-alert').post(sendWhatsAppMessage);
router.route('/login').post(loginUser);
router.route('/current-user').get(verifyJwt, getCurrentUser);
router.route('/logout').get(verifyJwt, logoutUser);

export default router;