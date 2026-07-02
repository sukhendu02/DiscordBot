import sequelize from "../config/database.js";


const syncDatabase = async ()=>{
    await sequelize.sync({alter:true});
    console.log("Database synchronized successfully");
}

export {sequelize, syncDatabase};