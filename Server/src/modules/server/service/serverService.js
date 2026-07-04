import { BadRequestError } from "../../../middleware/ErrorHandler.js"
import Server from "../../../models/servermodel.js"

export const getServerService= async (adminId)=>{
    return Server.findAll({ where: { adminId } });
}
export const createServerService = async(data, adminId)=>{
    const { discordGuildId, targetChannelId, mirrorWebhookUrl } = data
    if(!discordGuildId || !targetChannelId || !mirrorWebhookUrl){
        throw BadRequestError("discordGuildId, targetChannelId, and mirrorWebhookUrl are required")
    }

     return await Server.create({
      discordGuildId: data.discordGuildId,
      guildName: data.guildName ?? null,
      targetChannelId: data.targetChannelId,
      mirrorType: data.mirrorType ?? "slack",
      mirrorWebhookUrl: data.mirrorWebhookUrl,
      adminId,
    });
}

export const getServerByIdService = async(serverId, adminId)=>{
    if(!serverId){
        throw BadRequestError("Server id is missing")
    }
    const server = await Server.findOne({ where: { id: serverId, adminId } });
  if (!server) {
    throw new NotFoundError("Server not found");
  }
  return server;
}



export const updateServerService = async (serverId, data, adminId) => {
    if(!serverId){
        throw BadRequestError("Server id is missing")
    }
  const server = await Server.findOne({ where: { id: serverId, adminId } });
  if (!server) {
    throw new NotFoundError("Server not found");
  }
 
  const allowedFields = ["guildName", "targetChannelId", "mirrorType", "mirrorWebhookUrl"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) server[field] = data[field];
  });
 
  await server.save();
  return server;
};
 
export const deleteServerService = async (serverId, adminId) => {
    if(!serverId){
        throw BadRequestError("Server id is missing")
    }
  const server = await Server.findOne({ where: { id: serverId, adminId } });
  if (!server) {
    throw new NotFoundError("Server not found");
  }

  await server.destroy();
};

export const findServerByGuildId = async (discordGuildId) => {
  return Server.findOne({ where: { discordGuildId } });
};