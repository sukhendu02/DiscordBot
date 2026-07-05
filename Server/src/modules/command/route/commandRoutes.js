import express,{Router} from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {getCommands} from "../controller/commandController.js"
const router = Router();

router.get("/",authenticate,getCommands);




export default router;