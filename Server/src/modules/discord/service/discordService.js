
import CommandLog from "../../../models/commandLog.js";
import Server from "../../../models/servermodel.js";

const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  MODAL_SUBMIT: 5, 
};
const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
};
const ReplyText ={
    STATUS:`Bot is connected and working.`,
    REPORT:"Report received successfully."
}

export const discordInteractionService = async(interaction)=>{
// console.log("Received interaction:", interaction);
    if(interaction.type===InteractionType.PING){
        return {
            type:InteractionResponseType.PONG,
        }
    }

    if(interaction.type===InteractionType.APPLICATION_COMMAND){
        // const commandName = interaction.data?.name;

        return handleApplicationCommand(interaction);
        // return{
        //     type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        //     data:{
        //         content:`Received /${commandName}`
        //     }
        // }
    }

    return{
        type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
            content:"Unsupported interaction."
        }
    }
}

const handleApplicationCommand = async(interaction)=>{
  
    
    
    const commandName = interaction.data?.name;
    const inputText = interaction.data?.options?.[0]?.value??null;
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    const discordUsername = interaction.member?.user?.username || interaction.user?.username;

console.log("Command received:", { commandName, inputText, discordUserId, discordUsername });
    const server = await Server.findOne({where:{discordGuildId:interaction.guild_id}});

    if(!server){
        return{
            type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data:{
                content:"This sever hasn't ben connected yet"
            },
        }
    }
    // console.log("hi")
    
    // SAVE THE COMMAND IN DB
    const newCommandLog = await CommandLog.create({
        interactionId:interaction.id,
        serverId:server.id,
        interactionType: "application_command",
        commandName,
        discordUserId,
        discordUsername,
        inputText,
        status:"processing",
    });
    
    // BULD REPLY 
    const reply = commandName==="status" ? ReplyText.STATUS : ReplyText.REPORT;    
    newCommandLog.status = "completed";
    newCommandLog.respondedAt = new Date();
   
    
    await newCommandLog.save();
    return {
        type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
            content:reply,
        }
    }

    

}