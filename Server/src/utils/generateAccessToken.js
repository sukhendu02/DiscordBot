import jwt from "jsonwebtoken";

export const generateAccessToken = (adminUser)=>{
    const payLoad={
        id:adminUser.id,
        username:adminUser.username,
        email:adminUser.email,
    }
    return jwt.sign(payLoad,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN || "10h"
    })
}

export const verifyAccessToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}