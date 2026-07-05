
 import { getDashboardSummary } from "../service/dashboardService.js";

export const getDashboard = async (req, res, next) => {
  console.log("hi")
  const summary = await getDashboardSummary(req.admin.id);
  console.log("hi 2")
    return res.json(summary);
  
};