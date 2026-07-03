import {Router} from "express";
const router = Router();

import {  loginAdmin } from "../controller/authController.js";

// ROUTES

// router.post("/register",registerAdmin); //ADMIN SEEDED

router.post("/login",loginAdmin)

export default router;