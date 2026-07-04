import express from "express";
const app = express();

import { errorHandler, notFoundHandler } from "./src/middleware/ErrorHandler.js";
import helmet from "helmet";
import authRoute from "./src/modules/auth/route/authRoute.js";
import discordRoute from "./src/modules/discord/route/discordRoutes.js"
import rulesRoutes from "./src/modules/rules/routes/rulesRoutes.js"
import serverRoutes from "./src/modules/server/route/serverRoutes.js"
import cors from 'cors';
// HELMET MIDDLEWARE FOR SECURITY HEADERS
app.use(helmet()); 

// Enable CORS
app.use(cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL], 
    credentials: true,               
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

app.use("/api/v1/discord",discordRoute)

// Body parser
app.use(express.json());


// ROUTES 
app.use("/api/v1/auth",authRoute)

app.use("/api/v1/rules",rulesRoutes)

app.use("/api/v1/server",serverRoutes)

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