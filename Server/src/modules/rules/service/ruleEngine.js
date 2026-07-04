import Rules from "../../../models/rules.js";

export const matchRule = async (serverId, inputText) => {
  if (!inputText) return null;

  const rules = await Rules.findAll({
    where: { serverId, isActive: true },
    order: [["priority", "DESC"]],
  });

  const lowerInput = inputText.toLowerCase();
  return rules.find((rule) => lowerInput.includes(rule.keyword.toLowerCase())) || null;
};