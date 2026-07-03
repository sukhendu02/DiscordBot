export const commands = [
  {
    name: "report",
    description: "Log a report for this server",
    options: [
      {
        name: "text",
        description: "What are you reporting?",
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: "status",
    description: "Check the bot's current status for this server",
  },
];
