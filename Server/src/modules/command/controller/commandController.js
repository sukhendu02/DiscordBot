import {getCommandLogsService} from "../service/commandService.js"

export const getCommands = async(req,res)=>{
  const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
const data = await getCommandLogsService(req.admin.id,page,limit);

  return res.status(200).json({
    success: true,
    data,
  });
}