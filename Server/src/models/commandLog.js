import sequelize from '../config/database.js'
import {DataTypes,Model} from "sequelize";

const CommandLog = sequelize.define('CommandLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    
    interactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    serverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    interactionType: {
      type: DataTypes.ENUM('application_command', 'message_component', 'modal_submit'),
      allowNull: false,
      defaultValue: 'application_command',
    },
    commandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordUsername: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inputText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    matchedRuleId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    actionTaken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    status: {
      type: DataTypes.ENUM('received', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'received',
    },
    
    mirrorStatus: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    aiSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'command_logs',
    underscored:true,
    timestamps: true,

     indexes: [
      { unique: true, fields: ['interactionId'] },
      { fields: ['serverId', 'createdAt'] },
    ],
  }
);

export default CommandLog;