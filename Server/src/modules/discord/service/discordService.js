
import { text } from "express";
import CommandLog from "../../../models/commandLog.js";
import Server from "../../../models/servermodel.js";
import { matchRule } from "../../rules/service/ruleEngine.js";
import axios from 'axios';
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
    REPORT:`Report received successfully.`
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

const server = await Server.findOne({where:{discordGuildId:interaction.guild_id}});

if(!server){
    return{
        type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
            content:"This sever hasn't ben connected yet"
        },
    }
}
    
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

    const matchedRule = await matchRule(server.id, inputText);
    newCommandLog.matchedRuleId = matchedRule?.id ?? null;
    newCommandLog.actionTaken = matchedRule?.action ?? "Logged";
    
      // BULD REPLY 
    const reply = commandName==="status" ? ReplyText.STATUS : `${ReplyText.REPORT}  Action: ${newCommandLog.actionTaken}`;    


   
    // WEBHOOK
    if (commandName === "report"  && server.mirrorWebhookUrl) {
        newCommandLog.mirrorStatus = "pending";
        const payload = buildDiscordWebhookPayload({
            serverName:server.guildName,
            discordUsername,
            inputText,
            commandName,
            action:newCommandLog.actionTaken,
            type:server.mirrorType
        })

        const webhookResult = await sendDiscordWebhook(server.mirrorWebhookUrl,payload);
        newCommandLog.mirrorStatus = webhookResult.success ? "sent" : "failed";
        newCommandLog.mirrorResponse = webhookResult.response;
        newCommandLog.mirroredAt = webhookResult.success ? new Date() : null
    }
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

export const buildDiscordWebhookPayload = ({
  serverName,
  discordUsername,
  inputText,
  commandName,
  action,
  type
}) => {
  const messageText = ` **/${commandName}**

**Server:** ${serverName}
**User:** ${discordUsername}
**Report:** ${inputText || "(no input)"}
**Action:** ${action}`;

  if (type === "discord") {
    return {
      content: messageText,
    };
  }

  return {
    text: messageText,
  };
};

export const sendDiscordWebhook = async (webhookUrl, payload) => {
  try {
   const data = await axios.post(webhookUrl, payload, {
      timeout: 5000,
    });

    return {
      success: true,
      response: "Delivered",
    };
  } catch (error) {
    return {
      success: false,
      response: error.message,
    };
  }
};