
import { BadRequestError, NotFoundError } from "../../../middleware/ErrorHandler.js";
import { getRulesService,createRuleService,updateRuleService,deleteRuleService } from "../service/rulesService.js";


// GET ALL THE RULE CONTROLLER
export const getRules = async(req,res)=>{
    const {serverId}=req.query;
    if(!serverId){
        throw BadRequestError("ServerId is missing")
    }
    const rules  =await getRulesService(serverId,req.admin.id);
    return res.status(200).json({
        success:true,
        rules
    })
}

// POST THE RULE CONTROLLER
export const postRules = async(req,res)=>{
    const {serverId, keyword, action}= req.body;
    if(!serverId || !keyword ||!action){
        throw BadRequestError("Server Id, Keyward and action are required");
    }

    const rule = await createRuleService(req.body, req.admin.id);
    res.status(201).json({
        success:true,
        rule
    });
}

// UPDATE RULE CONTROLLER
export const updateRules = async(req,res)=>{
    const ruleId= req.params.ruleId
    console.log(ruleId)
      if(!ruleId){
        throw BadRequestError("Rule id is missing")
    }
    const updatedRule = await updateRuleService(ruleId,req.body,req.admin.id)
    return res.status(200).json({
        success:true,
        updatedRule
    })

}

export const deleteRule = async (req,res)=>{
    const ruleId = req.params.ruleId
    if(!ruleId){
        throw BadRequestError("Rule id is missing");
    }
        const deletedRule = await deleteRuleService(ruleId,req.admin.id);
        return res.status(204).send()
    
}

