import express,{Router} from "express";
import {discordInteraction} from "../controller/discordController.js";
import { verifyDiscordSign } from "../../../middleware/verifyDiscordSign.js";

const router = Router();

router.post("/interaction",  
    express.raw({ type: "application/json" }),
    verifyDiscordSign,
    discordInteraction
)


export default router;