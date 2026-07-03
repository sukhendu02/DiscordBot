import express from "express";
const app = express();

import { errorHandler, notFoundHandler } from "./src/middleware/ErrorHandler.js";
import helmet from "helmet";
import authRoute from "./src/modules/auth/route/authRoute.js";
import discordRoute from "./src/modules/discord/route/discordRoute.js";
// HELMET MIDDLEWARE FOR SECURITY HEADERS
app.use(helmet());    

app.use("/api/v1/discord",discordRoute)

// Body parser
app.use(express.json());


// ROUTES 
app.use("/api/v1/auth",authRoute)


// ROOT ROUTE
app.get("/",(req,res)=>{
    res.status(200).json({
        status:"success",
        message:"Welcome to the Discord Bot API"
    })
})

// HEALTH CHECK ENDPOINT    
app.get("/health",(req,res)=>{
    res.status(200).json({
        message:"Server is healthy",
        status:"ok"
    })
})

// ERROR HANDLER - 404
app.use(notFoundHandler);

//  ERROR HANDLER
app.use(errorHandler)
 
export default app;