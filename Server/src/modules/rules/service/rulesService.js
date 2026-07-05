import { ForbiddenError, NotFoundError } from "../../../middleware/ErrorHandler.js";
import Rules from "../../../models/rules.js";
import Server from "../../../models/servermodel.js";


// VERIFY SERVER ACCESS
const verifyServerOwnership = async (serverId, adminId) => {
  const server = await Server.findOne({ where: { id: serverId, adminId } });
  if (!server) {
    throw ForbiddenError("You don't have access to this server");
  }
  return server;
};



// GET RULES SERVICE
export const getRulesService = async (serverId,adminId)=>{

    console.log("serverId",serverId)
    console.log("adminId",adminId)
    const verify= await verifyServerOwnership(serverId,adminId);

    return Rules.findAll({
        where:{serverId},
        order:[["priority","DESC"]]
    });
}

// CREATE A RULE SERVICE
export const createRuleService = async (data,adminId)=>{
    const verify = await verifyServerOwnership(data.serverId,adminId);

    return Rules.create({
        serverId:data.serverId,
        keyword:data.keyword,
        action:data.action,
        priority:data.priority?? 0,
        isActive:data.isActive?? true,
    });
}

export const updateRuleService = async(ruleId,data,adminId)=>{
    const rule = await Rules.findOne({
        where:{id:ruleId}
    });
    if(!rule){
        throw NotFoundError("Rule not found");
    }

    const verify= await verifyServerOwnership(rule.serverId,adminId);
     const allowedFields = ["keyword", "action", "priority", "isActive"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) rule[field] = data[field];
  });

  await rule.save();
  return rule;
}

export const deleteRuleService = async(ruleId,adminId)=>{
    const rule= await Rules.findByPk(ruleId)
    if(!rule){
        throw NotFoundError("Rule not found");
    }
    await Rules.destroy({
        where:{id:ruleId}
    });
}


