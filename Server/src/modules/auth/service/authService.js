import { BadRequestError, UnauthorizedError } from "../../../middleware/ErrorHandler.js"
import Admin from "../../../models/admin.js"
import bcrypt from "bcrypt"

import {generateAccessToken} from "../../../utils/generateAccessToken.js"

// LOGIN SERVCIE
export const loginAdminService = async(userData)=>{
    const {email,password} = userData;

    if(!email || !password){
        throw BadRequestError("Email and Password are required")
    }

    // FIND ADMIN
    const adminUser = await Admin.findOne({
        where:{email}
    })

    if(!adminUser){
        throw UnauthorizedError("Invalid Credentials")
    }

    // CHECK PASSWORD
    const isMatch =await bcrypt.compare(password,adminUser.password)
    if(!isMatch){
        throw UnauthorizedError("Invalid Credentials")
    }

    const accessToken = generateAccessToken(adminUser);

    return {
        admin:{
            id:adminUser.id,
            username:adminUser.username,
            email:adminUser.email,
        },
        accessToken
    }

}