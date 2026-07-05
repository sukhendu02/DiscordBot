import express,{Router} from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { getDashboard } from "../controller/dashboardController.js";

const router = Router();

router.get("/summary",authenticate,getDashboard)


export default router;