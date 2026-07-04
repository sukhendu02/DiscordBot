import nacl from "tweetnacl";
import express from "express";
import { BadRequestError, UnauthorizedError } from "./ErrorHandler.js";


const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;


// CHECK ENV
if(!DISCORD_PUBLIC_KEY){
    throw BadRequestError("Invalid Discord Public Key")
}

// VERIFY DISCORD SIGNATURE MIDDLEWARE
export const verifyDiscordSign = (req,res,next)=>{
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    

    const rawBody = req.body
  
    if(!signature || !timestamp ||!Buffer.isBuffer(rawBody) ){
        throw UnauthorizedError("Missing discord signature headers")
    }

    const isValid = nacl.sign.detached.verify(
        Buffer.concat([Buffer.from(timestamp,"utf8"),rawBody]),
        Buffer.from(signature,'hex'),
        Buffer.from(DISCORD_PUBLIC_KEY,"hex")
    );


    // console.log(isValid);


    if (!isValid) {
    return res.status(401).end("invalid request signature");
}

    try {
        req.discordBody=JSON.parse(rawBody.toString("utf8"))
    } catch (error) {
        throw BadRequestError("Invalid JSON body");
    }

    next();
}