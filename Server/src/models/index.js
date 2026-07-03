import sequelize from "../config/database.js";

import Admin from "./admin.js"
import Server from "./servermodel.js";
// import Rule from "./rule.js";
import {DataTypes,Model} from "sequelize";
import CommandLog from "./commandLog.js";

Admin.hasMany(Server, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Server.belongsTo(Admin, { foreignKey: 'adminId' });
 
// Server <-> Rule
// Server.hasMany(Rule, { foreignKey: 'serverId', onDelete: 'CASCADE' });
// Rule.belongsTo(Server, { foreignKey: 'serverId' });
 
// Server <-> CommandLog
Server.hasMany(CommandLog, { foreignKey: 'serverId', onDelete: 'CASCADE' });
CommandLog.belongsTo(Server, { foreignKey: 'serverId' });
 
// Rule <-> CommandLog
// If a rule is deleted, keep the historical log rows — just null out the
// reference rather than deleting audit history.

// Rule.hasMany(CommandLog, { foreignKey: 'matchedRuleId', onDelete: 'SET NULL' });
// CommandLog.belongsTo(Rule, { foreignKey: 'matchedRuleId', as: 'matchedRule' });

const syncDatabase = async ()=>{
    await sequelize.sync({alter:true});
    console.log("Database synchronized successfully");
}

export {sequelize, syncDatabase};