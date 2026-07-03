import express from "express";
const app = express();

import { errorHandler, notFoundHandler } from "./src/middleware/ErrorHandler.js";


// Body parser
app.use(express.json());

     
 
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