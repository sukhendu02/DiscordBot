import CommandLog from "../../../models/commandLog.js";
import Rules from "../../../models/rules.js";
import Server from "../../../models/servermodel.js";


export const getCommandLogsService = async (adminId,page,limit)=>{
    const offset = (page - 1) * limit;

    const { count, rows } = await CommandLog.findAndCountAll({
         include: [
      {
        model: Server,
        where: { adminId },
        attributes: ["id", "guildName"],
      },
      {
        model: Rules,
        as:"matchedRule",
        attributes: ["id", "keyword", "action"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
   return {
    logs: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNext: page * limit < count,
      hasPrevious: page > 1,
    },
  };
}