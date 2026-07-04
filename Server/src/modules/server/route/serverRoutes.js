import express,{Router} from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { getServers,createServers,getServerById,updateServer,removeServer } from "../controller/serverController.js";
const router = Router();

router.get("/",authenticate,getServers);
router.post("/",authenticate,createServers);
router.get("/:id",authenticate, getServerById); 
router.patch("/:id",authenticate, updateServer);
router.delete("/:id",authenticate, removeServer); 

 




export default router;