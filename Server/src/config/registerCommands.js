import { commands } from "../utils/commands.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import axios from "axios";

// IMPORT ENVS
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const GUILD_ID = process.env.DISCORD_SERVER_ID


// RESGISTER COMMANDS FUNCTION 
const registerCommands = async()=>{
try {
    
const url=`https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`

    const response = await axios.put(url,commands,{
        headers:{
            Authorization:`Bot ${BOT_TOKEN}`,
            "Content-Type":"application/json"
        }
    })

    console.log("Command Added Successfully",response)

    } catch (error) {
    
       if (error.response) {
      console.error("CHECK THIS",error.response.data);
    } else {
      console.error(error.message);
    }

    process.exit(1);
}
}

registerCommands();