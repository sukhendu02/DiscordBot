// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../config/database');
import sequelize from '../config/database.js'
import {DataTypes,Model} from "sequelize";

const Admin = sequelize.define('Admin',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'admins',
    underscored:true,
    timestamps: true,
  }
);

export default Admin;