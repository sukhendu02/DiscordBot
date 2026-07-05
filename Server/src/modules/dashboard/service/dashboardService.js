import { Op } from "sequelize";
import CommandLog from "../../../models/commandLog.js";
import Server from "../../../models/servermodel.js";

export const getDashboardSummary = async(adminId)=>{

     const servers = await Server.findAll({
    where: { adminId },
    attributes: ["id", "guildName"],
  });
  const serverIds = servers.map((s) => s.id);
 
  if (serverIds.length === 0) {
    return {
      totalCommandsToday: 0,
      activeServersCount: 0,
      failedMirrorCount: 0,
      recentActivity: [],
    };
  }
 
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
 
  const [totalCommandsToday, failedMirrorCount, recentActivity] = await Promise.all([
    CommandLog.count({
      where: {
        serverId: serverIds,
        createdAt: { [Op.gte]: startOfToday },
      },
    }),
    CommandLog.count({
      where: {
        serverId: serverIds,
        mirrorStatus: "failed",
      },
    }),
    CommandLog.findAll({
      where: { serverId: serverIds },
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [{ model: Server, attributes: ["guildName"] }],
    }),
  ]);
 
  return {
    totalCommandsToday,
    activeServersCount: servers.length,
    failedMirrorCount,
    recentActivity,
  };
}