
import sequelize from '../config/database.js'
import {DataTypes,Model} from "sequelize";

const Server = sequelize.define('Server',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
   
    discordGuildId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    guildName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    targetChannelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mirrorType: {
      type: DataTypes.ENUM('slack', 'discord'),
      allowNull: false,
      defaultValue: 'slack',
    },
    mirrorWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  
  {
    tableName: 'servers',
    underscored:true,
    timestamps: true,
  }
);
export default Server;