import {Router} from "express";
const router = Router();

import {  loginAdmin,getAdmin } from "../controller/authController.js";
import { authenticate } from "../../../middleware/authenticate.js";

// ROUTES

// router.post("/register",registerAdmin); //ADMIN SEEDED

router.post("/login",loginAdmin)
router.get("/me",authenticate,getAdmin)

export default router;