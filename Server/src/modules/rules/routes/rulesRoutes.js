import express,{Router} from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {getRules,postRules,updateRules} from "../controller/rulesController.js"

const router = Router();

router.get("/",authenticate,getRules);
router.post("/",authenticate,postRules);
router.patch("/:ruleId",authenticate,updateRules);




export default router;