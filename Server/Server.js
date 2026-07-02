
import app from "./app.js";

import { syncDatabase } from "./src/models/index.js";
import sequelize from "./src/config/database.js"
import dotenv from 'dotenv'
dotenv.config();


const PORT = process.env.PORT || 5000;

// START THE SERVER
const startServer = async () => {
  try{
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    await syncDatabase();

  }catch(error){

    console.error("Error starting server:", error);
  }
};

startServer();