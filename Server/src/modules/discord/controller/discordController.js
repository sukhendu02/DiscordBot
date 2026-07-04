import { discordInteractionService } from "../service/discordService.js";

export const discordInteraction = async(req,res,next)=>{
    const interaction = req.discordBody;

    const response = await discordInteractionService(interaction);
    console.log("this is the response",response
    )
    return res.status(200).json(response);
    
}

