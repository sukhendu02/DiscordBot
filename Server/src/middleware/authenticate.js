import Admin from "../models/admin.js";
import { verifyAccessToken } from "../utils/generateAccessToken.js";
import { UnauthorizedError } from "./ErrorHandler.js";

// AUTH MIDDILEWARE 
export const authenticate = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw UnauthorizedError("Authorization header missing or invalid")
    }
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decodedToken = verifyAccessToken(token);


    // FIND ADMIN
    const adminUser = await Admin.findByPk(decodedToken.id);

    if(!adminUser){
        throw UnauthorizedError("Admin user not found")
    }

   
    // SET ADMIN
    req.admin = adminUser;
    next();
}